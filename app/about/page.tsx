'use client'

import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] via-[#0b0f1a] to-[#0b0f1a] text-zinc-100">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 gap-8 px-4 py-10">
        <section className="space-y-6 order-1">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Explore Events</h1>
          <p className="text-zinc-300">Discover transparent, community-funded shows with gasless voting and clear treasury splits. LAcra makes it simple to fund an event, vote the lineup, and get your ticket in one place.</p>
          <div className="flex gap-3">
            <Link href="/events"><Button size="lg">Browse Events</Button></Link>
            <Link href="/profile"><Button size="lg" variant="secondary">Your Profile</Button></Link>
          </div>
          <Separator className="my-4" />
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-300">
            <li>Fund the event: buy tickets across pricing tiers; progress is transparent.</li>
            <li>Vote the lineup: holders vote gaslessly; highest support is booked.</li>
            <li>Showtime: if quorum and target are reached, the event is confirmed.</li>
          </ol>
          <Separator className="my-4" />
          <h2 className="text-2xl font-semibold">Protocol Overview</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>Storage & Identity: Supabase auth and profiles with RLS policies.</li>
            <li>Treasury: on/off-chain accounting with clear splits and caps.</li>
            <li>Voting: 1 ticket = 1 vote; Snapshot-style off-chain tallying supported.</li>
            <li>Tickets: tiered pricing, caps, and QR pass codes; redemption tracked.</li>
          </ul>
          <div className="flex gap-2 pt-2">
            <Badge className="bg-zinc-800 text-zinc-200">Base</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">USDC</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">Snapshot</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">Supabase</Badge>
          </div>
        </section>
        <aside className="order-2">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 h-80 w-full" />
        </aside>
      </main>
    </div>
  )
}

