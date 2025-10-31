'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getSupabase, supabaseReady } from '@/lib/supabase'

type EventRow = {
  id: string
  title: string
  location: string | null
  event_date: string | null
  deadline_date: string | null
  target: number
  raised: number
  tickets_cap: number
  quorum: number
  tags: string[]
}

type EventWithLineup = EventRow & { lineup: string[] }

const fallbackEvents: EventWithLineup[] = [
  {
    id: 'lera-0',
    title: 'LAcra Genesis #0',
    location: 'Santa Marta / Tayrona area',
    event_date: '2026-03-15',
    deadline_date: '2025-11-30',
    target: 20000,
    raised: 7680,
    tickets_cap: 1000,
    quorum: 35,
    tags: ['Open-air', 'Transparent budget', 'Decentralized'],
    lineup: ['Kindzadza', 'Ajja', 'Earthling'],
  },
]

function EventCard({ e }: { e: EventWithLineup }) {
  const pct = Math.min(100, Math.round((e.raised / Math.max(1, e.target)) * 100))
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
      <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="text-xl font-semibold">{e.title}</div>
        <Badge className="bg-purple-500/10 text-purple-300">Funding</Badge>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-sm text-zinc-300">{e.location}</div>
        <div className="text-sm text-zinc-400">Event: {e.event_date || 'TBD'} · Deadline: {e.deadline_date || 'TBD'}</div>
        <div className="flex flex-wrap gap-2">{e.tags?.map((t) => <Badge key={t} className="bg-zinc-800 text-zinc-200">{t}</Badge>)}</div>
        <div className="text-sm text-zinc-300">Line-up: {e.lineup.join(', ')}</div>
        <div>
          <Progress value={pct} className="h-2" />
          <div className="mt-1 text-xs text-zinc-400">${e.raised.toLocaleString()} / ${e.target.toLocaleString()}</div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" className="gap-2">Buy Ticket</Button>
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithLineup[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!supabaseReady) {
          setEvents(fallbackEvents)
          return
        }
        const supabase = getSupabase()
        const { data: rows, error } = await supabase
          .from('events')
          .select('id,title,location,event_date,deadline_date,target,raised,tickets_cap,quorum,tags')
          .order('created_at', { ascending: false })
        if (error) throw error
        const ids = (rows || []).map((r) => r.id)
        let lineupMap = new Map<string, string[]>()
        if (ids.length) {
          // Fetch lineup per event via join
          const { data: ea } = await supabase
            .from('event_artists')
            .select('event_id, artists(name)')
            .in('event_id', ids)
          for (const row of ea || []) {
            const arr = lineupMap.get(row.event_id) || []
            const name = (row as any).artists?.name
            if (name) arr.push(name)
            lineupMap.set(row.event_id, arr)
          }
        }
        const result: EventWithLineup[] = (rows || []).map((r: any) => ({ ...r, lineup: lineupMap.get(r.id) || [] }))
        setEvents(result)
      } catch (_err) {
        setEvents(fallbackEvents)
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
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Events</h1>
        {loading && <div className="text-sm text-zinc-400">Loading events…</div>}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {(events || []).map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

