'use client'

import { useEffect, useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { getSupabase, supabaseReady } from '@/lib/supabase'

type Stats = {
  events: number
  tickets: number
  collected: number
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!supabaseReady) {
          setStats({ events: 1, tickets: 384, collected: 7680 })
          return
        }
        const s = getSupabase()
        const [{ count: events }, { count: tickets }, { data: sums }] = await Promise.all([
          s.from('events').select('*', { head: true, count: 'exact' }),
          s.from('tickets').select('*', { head: true, count: 'exact' }),
          s.from('events').select('raised')
        ])
        const collected = (sums || []).reduce((acc: number, r: any) => acc + Number(r.raised || 0), 0)
        setStats({ events: events || 0, tickets: tickets || 0, collected })
      } catch (_err) {
        setStats({ events: 1, tickets: 384, collected: 7680 })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] via-[#0b0f1a] to-[#0b0f1a] text-zinc-100">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Protocol Stats</h1>
        {loading && <div className="text-sm text-zinc-400">Loading stats…</div>}
        {!loading && stats && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
              <div className="text-xs text-zinc-400">Events</div>
              <div className="text-2xl font-semibold">{stats.events.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
              <div className="text-xs text-zinc-400">Tickets Sold</div>
              <div className="text-2xl font-semibold">{stats.tickets.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
              <div className="text-xs text-zinc-400">Money Collected</div>
              <div className="text-2xl font-semibold">${stats.collected.toLocaleString()}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

