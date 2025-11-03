'use client'

import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type Highlight = {
  title: string
  detail: string
}

type RoundNarrative = {
  title: string
  whatHappens: string
  result: string
  status: 'Complete' | 'Active' | 'Pending'
}

type SummaryRow = {
  concept: string
  description: string
}

const highlights: Highlight[] = [
  {
    title: 'Tickets are funding and votes',
    detail:
      'Each ticket equals 5 EUR (or a pegged stablecoin) and one vote. Wallets stack tickets until they reach the entrance threshold.',
  },
  {
    title: 'Transparent budget meters',
    detail:
      'Artists, sound, lights, and extras show funding targets with live progress. Items lock in automatically when their target is met.',
  },
  {
    title: 'Refund-first flow',
    detail:
      'If quorum slips or a round restarts, tickets unlock for instant refunds so supporters never shoulder hidden risk.',
  },
]

const rounds: RoundNarrative[] = [
  {
    title: 'Round 1 - Base',
    whatHappens: 'Ticket sales open. Core infrastructure and must-have artists gather votes and funding.',
    result: 'If the minimum quorum (for example 60 percent of the total goal) is reached, the event advances.',
    status: 'Complete',
  },
  {
    title: 'Round 2 - Confirmation',
    whatHappens: 'Highest-voted artists and confirmed operations are booked and held in escrow.',
    result: 'Locked-in allocations remain for the next round; unfunded goals stay open.',
    status: 'Complete',
  },
  {
    title: 'Round 3 - Expansion',
    whatHappens: 'Optional upgrades unlock while tickets continue to sell (extra acts, visuals, chill spaces).',
    result: 'Runs as long as demand continues. Participants can redirect votes live.',
    status: 'Active',
  },
  {
    title: 'Round 4 - Settlement',
    whatHappens: 'On-site crew verifies performances, authorises final payments, and issues refunds where required.',
    result: 'A final ledger is published and any surplus is distributed to ticket holders.',
    status: 'Pending',
  },
]

const summaryTable: SummaryRow[] = [
  { concept: 'Ticket', description: '5 EUR contribution and 1 governance vote.' },
  { concept: 'Entrance Threshold', description: 'Tickets required to attend (for example 1-5 depending on the event).' },
  { concept: 'Vote', description: 'Allocate funding to artists, infrastructure, or upgrades.' },
  { concept: 'Round', description: 'Funding cycle state change; restarts if goals are not met.' },
  { concept: 'Refund', description: 'Always available when a round restarts or fails quorum.' },
  { concept: 'Profit Sharing', description: 'Surplus distributed proportionally to ticket holders.' },
  { concept: 'On-site Vote', description: 'Crew verifies delivery before releasing final payouts.' },
  { concept: 'Transparency', description: 'Full budget, vote, and transaction history stays public.' },
]

const philosophy: Highlight[] = [
  {
    title: 'Decentralised creation',
    detail: 'Every ticket holder shapes the event by steering funding and helping pick the acts.',
  },
  {
    title: 'Transparency by default',
    detail: 'Budgets, votes, and payouts remain visible so anyone can audit how the treasury evolves.',
  },
  {
    title: 'Fair risk and shared reward',
    detail: 'Automatic refunds protect the crowd while successful events return surplus to supporters.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07130d] via-[#061a12] to-[#04140e] text-zinc-100">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <section className="space-y-6">
          <Badge className="bg-emerald-500/10 text-emerald-200">Collective Event Funding</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Lera Protocol</h1>
          <p className="max-w-3xl text-sm text-zinc-300 md:text-lg">
            Lera turns the crowd into co-producers. Tickets double as capital and voting power, moving an event through
            transparent funding rounds. Every cost is visible, refunds are always possible, and profits flow back to the
            people who believed first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/events">
              <Button size="lg" className="gap-2">Explore the funding simulator</Button>
            </Link>
            <Link href="/stats">
              <Button size="lg" variant="secondary" className="gap-2">
                View protocol stats
              </Button>
            </Link>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Essence</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
                <div className="text-sm font-semibold text-zinc-100">{item.title}</div>
                <p className="mt-2 text-sm text-zinc-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Funding Rounds</h2>
            <Badge className="bg-emerald-500/10 text-emerald-200">Rounds restart if quorum fails</Badge>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {rounds.map((item) => (
              <div key={item.title} className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-zinc-100">{item.title}</div>
                    <p className="mt-2 text-sm text-zinc-300">{item.whatHappens}</p>
                  </div>
                  <Badge
                    className={
                      item.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-200'
                        : item.status === 'Pending'
                        ? 'bg-purple-500/10 text-purple-200'
                        : 'bg-zinc-800 text-zinc-200'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="rounded-xl border border-zinc-800/60 bg-black/30 p-3 text-xs text-zinc-400">
                  {item.result}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Summary Table</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-1 divide-y divide-zinc-800/70 md:grid-cols-[220px_1fr] md:divide-y-0 md:divide-x">
              {summaryTable.map((row) => (
                <div key={row.concept} className="grid grid-cols-1 md:grid-cols-subgrid">
                  <div className="bg-black/25 px-4 py-3 text-sm font-semibold text-zinc-100 md:px-5 md:py-4">
                    {row.concept}
                  </div>
                  <div className="px-4 py-3 text-sm text-zinc-300 md:px-5 md:py-4">{row.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Transparency and Settlement</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
              <div className="text-sm font-semibold text-zinc-100">Refund logic</div>
              <p className="mt-2 text-sm text-zinc-300">
                Tickets remain refundable whenever a round restarts or an event stalls. When quorum returns, the same
                tickets stay valid without extra action from supporters.
              </p>
              <p className="mt-3 text-xs text-zinc-400">
                Entrance thresholds make sure attendees are committed while keeping the exit ramp safe.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
              <div className="text-sm font-semibold text-zinc-100">Profit distribution</div>
              <p className="mt-2 text-sm text-zinc-300">
                After the event, the crew confirms each performance on-site before releasing payments. Any surplus left
                in the treasury flows straight back to ticket holders according to their share of tickets held.
              </p>
              <p className="mt-3 text-xs text-zinc-400">
                No-shows or cancelled acts forfeit their allocation, increasing the surplus available to the crowd.
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Philosophy</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {philosophy.map((item) => (
              <div key={item.title} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="text-sm font-semibold text-emerald-200">{item.title}</div>
                <p className="mt-2 text-sm text-emerald-100/80">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
