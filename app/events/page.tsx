'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type FundingCategory = 'artists' | 'infrastructure' | 'extras'
type RoundPhase = 'base' | 'confirmation' | 'expansion' | 'settlement'
type RoundStatus = 'complete' | 'active' | 'upcoming' | 'settlement'

type FundingItem = {
  id: string
  name: string
  description: string
  category: FundingCategory
  target: number
  pledged: number
  votes: number
  round: RoundPhase
  locked: boolean
}

type FundingRound = {
  id: string
  title: string
  phase: RoundPhase
  status: RoundStatus
  summary: string
  quorum?: number
  startedAt?: string
  endedAt?: string
}

type TicketConfig = {
  price: number
  currency: string
  stablecoin: string
  sold: number
  supply: number
  threshold: number
  entranceThreshold: number
  refundableUntil: string
}

type TransparencyEntry = {
  label: string
  value: string
  detail?: string
}

type ProtocolEvent = {
  id: string
  name: string
  location: string
  eventDate: string
  description: string
  rounds: FundingRound[]
  fundingItems: FundingItem[]
  ticket: TicketConfig
  transparency: TransparencyEntry[]
  refunds: {
    policy: string
    note: string
  }
}

const categoryLabels: Record<FundingCategory, string> = {
  artists: 'Artists and Acts',
  infrastructure: 'Infrastructure',
  extras: 'Expansion and Extras',
}

const categoryOrder: FundingCategory[] = ['artists', 'infrastructure', 'extras']

const protocolEvents: ProtocolEvent[] = [
  {
    id: 'lera-orbita-01',
    name: 'Lera Orbita 01',
    location: 'Santa Marta / Tayrona, Colombia',
    eventDate: '2026-03-15',
    description:
      'Round-based community funding for the first Lera Orbita gathering. Tickets double as votes that steer artists, infrastructure, and expansion upgrades.',
    rounds: [
      {
        id: 'round-base',
        title: 'Round 1 - Base',
        phase: 'base',
        status: 'complete',
        summary: 'Ticket sales opened and essential infrastructure cleared the 60 percent quorum to proceed.',
        quorum: 0.6,
        startedAt: '2025-09-07',
        endedAt: '2025-10-05',
      },
      {
        id: 'round-confirmation',
        title: 'Round 2 - Confirmation',
        phase: 'confirmation',
        status: 'complete',
        summary: 'Top-voted artists and critical vendors were booked. Deposits are locked in on escrow.',
        quorum: 0.75,
        startedAt: '2025-10-06',
        endedAt: '2025-10-28',
      },
      {
        id: 'round-expansion',
        title: 'Round 3 - Expansion',
        phase: 'expansion',
        status: 'active',
        summary: 'Optional upgrades are open while tickets continue to sell. Votes shift funding toward extras.',
        quorum: 0.85,
        startedAt: '2025-10-29',
      },
      {
        id: 'round-settlement',
        title: 'Round 4 - Settlement',
        phase: 'settlement',
        status: 'upcoming',
        summary:
          'Final community review, refunds, and payout confirmations occur on-site before publishing the ledger.',
        quorum: 1,
        startedAt: '2026-03-15',
      },
    ],
    fundingItems: [
      {
        id: 'artist-kindzadza',
        name: 'Kindzadza (Live)',
        description: 'Headliner live psytrance set with modular rigs and dedicated engineer.',
        category: 'artists',
        target: 3500,
        pledged: 3500,
        votes: 882,
        round: 'confirmation',
        locked: true,
      },
      {
        id: 'artist-ajja',
        name: 'Ajja',
        description: 'Hybrid DJ set, booked upon passing 80 percent of the artist pool target.',
        category: 'artists',
        target: 3200,
        pledged: 2920,
        votes: 734,
        round: 'expansion',
        locked: false,
      },
      {
        id: 'artist-earthling',
        name: 'Earthling',
        description: 'Progressive psy closing set; still gathering final votes for confirmation.',
        category: 'artists',
        target: 2400,
        pledged: 2105,
        votes: 518,
        round: 'expansion',
        locked: false,
      },
      {
        id: 'infra-sound-system',
        name: 'Function-One Sound System',
        description: 'Full-range stack with onsite technician and night monitoring.',
        category: 'infrastructure',
        target: 2800,
        pledged: 2800,
        votes: 902,
        round: 'base',
        locked: true,
      },
      {
        id: 'infra-lighting',
        name: 'Lighting and Lasers',
        description: 'Programmable lighting rig and operators for both nights.',
        category: 'infrastructure',
        target: 1800,
        pledged: 1520,
        votes: 465,
        round: 'expansion',
        locked: false,
      },
      {
        id: 'infra-venue',
        name: 'Tayrona Venue Lease',
        description: 'Two-night venue lease, permits, and insurance for the location.',
        category: 'infrastructure',
        target: 3200,
        pledged: 3200,
        votes: 998,
        round: 'confirmation',
        locked: true,
      },
      {
        id: 'extra-visuals',
        name: 'Visual Mapping Stage',
        description: 'Immersive projection mapping stage with local VJ crew.',
        category: 'extras',
        target: 1400,
        pledged: 960,
        votes: 388,
        round: 'expansion',
        locked: false,
      },
      {
        id: 'extra-chill',
        name: 'Chill-out Dome',
        description: 'Shaded space with ambient soundscape and tea service.',
        category: 'extras',
        target: 1100,
        pledged: 620,
        votes: 276,
        round: 'expansion',
        locked: false,
      },
    ],
    ticket: {
      price: 5,
      currency: 'EUR',
      stablecoin: 'EURC',
      sold: 3120,
      supply: 4000,
      threshold: 1500,
      entranceThreshold: 3,
      refundableUntil: '2026-01-20',
    },
    transparency: [
      {
        label: 'Ticket Pool',
        value: '3,120 tickets sold / cap 4,000',
        detail: 'EUR 15,600 committed at EUR 5 per ticket.',
      },
      {
        label: 'Locked-in Budget',
        value: 'EUR 9,500 confirmed deposits',
        detail: 'Headliners, venue, and core sound are secured in escrow.',
      },
      {
        label: 'Live Expansion Buffer',
        value: 'EUR 3,760 still available',
        detail: 'Active votes decide which extras settle by Round 3.',
      },
      {
        label: 'Last Settlement Snapshot',
        value: 'Round 2 ledger published 28 Oct 2025',
        detail: 'Hash: 0x9344a8f1 / mirrored to IPFS.',
      },
    ],
    refunds: {
      policy: 'Tickets remain refundable whenever a round fails quorum or before settlement locks.',
      note: 'Current refund window stays open until 20 Jan 2026 while the expansion round runs.',
    },
  },
]

type VoteAllocations = Record<string, number>

const defaultEvent = protocolEvents[0]

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(value?: string) {
  if (!value) return 'TBD'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function percentLabel(value: number) {
  return `${Math.round(value * 100)}%`
}

function makeAllocationSeed(items: FundingItem[]): VoteAllocations {
  return Object.fromEntries(items.map((item) => [item.id, 0]))
}

function calculateFundingTotals(items: FundingItem[]) {
  return items.reduce(
    (acc, item) => {
      acc.totalTarget += item.target
      acc.totalPledged += item.pledged
      if (item.locked) {
        acc.lockedTarget += item.target
        acc.lockedItems += 1
      }
      return acc
    },
    { totalTarget: 0, totalPledged: 0, lockedTarget: 0, lockedItems: 0 },
  )
}

function clampVotes(allocations: VoteAllocations, limit: number) {
  let total = Object.values(allocations).reduce((acc, value) => acc + value, 0)
  if (total <= limit) return allocations
  const next: VoteAllocations = { ...allocations }
  for (const key of Object.keys(next)) {
    if (total <= limit) break
    const current = next[key]
    if (!current) continue
    const deduction = Math.min(current, total - limit)
    next[key] = current - deduction
    total -= deduction
  }
  return next
}

export default function EventsPage() {
  const [selectedId, setSelectedId] = useState<string>(defaultEvent.id)
  const [ticketsHeld, setTicketsHeld] = useState<number>(defaultEvent.ticket.entranceThreshold)
  const [voteAllocations, setVoteAllocations] = useState<VoteAllocations>(() => makeAllocationSeed(defaultEvent.fundingItems))

  const selectedEvent = useMemo(
    () => protocolEvents.find((item) => item.id === selectedId) ?? defaultEvent,
    [selectedId],
  )

  useEffect(() => {
    setVoteAllocations(makeAllocationSeed(selectedEvent.fundingItems))
    setTicketsHeld(selectedEvent.ticket.entranceThreshold)
  }, [selectedEvent])

  const totals = useMemo(() => calculateFundingTotals(selectedEvent.fundingItems), [selectedEvent])
  const totalVotesUsed = useMemo(
    () => Object.values(voteAllocations).reduce((acc, value) => acc + value, 0),
    [voteAllocations],
  )
  const votesRemaining = Math.max(0, ticketsHeld - totalVotesUsed)

  const groupedItems = useMemo(() => {
    return selectedEvent.fundingItems.reduce<Record<FundingCategory, FundingItem[]>>(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
      },
      { artists: [], infrastructure: [], extras: [] },
    )
  }, [selectedEvent.fundingItems])

  const handleSelectEvent = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleBuyTicket = useCallback(() => {
    setTicketsHeld((prev) => prev + 1)
  }, [])

  const handleRefundTicket = useCallback(() => {
    setTicketsHeld((prev) => {
      const next = Math.max(0, prev - 1)
      setVoteAllocations((allocations) => clampVotes(allocations, next))
      return next
    })
  }, [])

  const handleAllocateVote = useCallback(
    (itemId: string) => {
      if (votesRemaining <= 0) return
      setVoteAllocations((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }))
    },
    [votesRemaining],
  )

  const handleRemoveVote = useCallback((itemId: string) => {
    setVoteAllocations((prev) => {
      const current = prev[itemId] ?? 0
      if (current <= 0) return prev
      return { ...prev, [itemId]: current - 1 }
    })
  }, [])

  useEffect(() => {
    setVoteAllocations((prev) => clampVotes(prev, ticketsHeld))
  }, [ticketsHeld])

  const totalRevenue = selectedEvent.ticket.sold * selectedEvent.ticket.price
  const lockedCoverage = totals.lockedTarget / Math.max(1, totalRevenue)
  const pledgedCoverage = totals.totalPledged / Math.max(1, totals.totalTarget)
  const projectedSurplus = Math.max(0, totalRevenue - totals.lockedTarget)
  const yourProjectedShare =
    ticketsHeld === 0 || selectedEvent.ticket.sold === 0
      ? 0
      : (projectedSurplus * ticketsHeld) / selectedEvent.ticket.sold

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07130d] via-[#061a12] to-[#04140e] text-zinc-100">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Collective Funding Rounds</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-300 md:text-base">
                Every ticket on Lera equals 5 EUR of funding power and one vote. Communities progress their event
                through transparent rounds - base, confirmation, expansion, and settlement - refunding safely whenever
                quorum is missed.
              </p>
            </div>
            <div className="flex gap-2">
              {protocolEvents.map((event) => (
                <Button
                  key={event.id}
                  variant={event.id === selectedEvent.id ? 'default' : 'ghost'}
                  size="sm"
                  className={event.id === selectedEvent.id ? 'bg-emerald-400 text-zinc-900' : ''}
                  onClick={() => handleSelectEvent(event.id)}
                >
                  {event.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm uppercase tracking-wide text-emerald-300">Event Pool</div>
                <Badge className="bg-emerald-400/10 text-emerald-200">Live</Badge>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{selectedEvent.name}</h2>
              <p className="text-sm text-zinc-300">{selectedEvent.location}</p>
              <p className="text-xs text-zinc-400">Event date / {formatDate(selectedEvent.eventDate)}</p>
              <p className="mt-3 text-sm text-zinc-200">{selectedEvent.description}</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
              <div className="text-sm uppercase tracking-wide text-zinc-400">Ticket Treasury</div>
              <div className="mt-2 text-2xl font-semibold">
                {formatCurrency(totalRevenue, selectedEvent.ticket.currency)}
              </div>
              <p className="text-xs text-zinc-400">
                {selectedEvent.ticket.sold.toLocaleString()} tickets sold / cap {selectedEvent.ticket.supply.toLocaleString()}
              </p>
              <div className="mt-4 space-y-2 text-sm text-zinc-300">
                <p>
                  Entrance threshold:{' '}
                  <span className="font-medium">{selectedEvent.ticket.entranceThreshold} tickets per wallet</span>
                </p>
                <p>
                  Refundable until{' '}
                  <span className="font-medium">
                    {formatDate(selectedEvent.ticket.refundableUntil)}
                  </span>
                  . Auto-refund triggers on quorum failure.
                </p>
                <p>
                  Stablecoin treasury uses {selectedEvent.ticket.stablecoin} at a 1 to 1 peg with EUR.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
              <div className="text-sm uppercase tracking-wide text-zinc-400">Funding Coverage</div>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <div>
                  <div className="flex items-center justify-between">
                    <span>Locked-in essentials</span>
                    <span className="text-zinc-100">
                      {formatCurrency(totals.lockedTarget, selectedEvent.ticket.currency)}
                    </span>
                  </div>
                  <Progress value={Math.min(100, Math.round(lockedCoverage * 100))} className="mt-2 h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span>Pledged vs goals</span>
                    <span className="text-zinc-100">
                      {formatCurrency(totals.totalPledged, selectedEvent.ticket.currency)} of{' '}
                      {formatCurrency(totals.totalTarget, selectedEvent.ticket.currency)}
                    </span>
                  </div>
                  <Progress value={Math.min(100, Math.round(pledgedCoverage * 100))} className="mt-2 h-1.5" />
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-200">
                  {formatCurrency(projectedSurplus, selectedEvent.ticket.currency)} surplus available for community
                  distribution at settlement.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Funding Rounds</h2>
            <Badge className="bg-zinc-800 text-zinc-200">
              {selectedEvent.rounds.find((round) => round.status === 'active')?.title ?? 'No active round'}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {selectedEvent.rounds.map((round) => (
              <div key={round.id} className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">{round.phase}</div>
                    <div className="text-lg font-semibold text-zinc-100">{round.title}</div>
                  </div>
                  <Badge
                    className={
                      round.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : round.status === 'complete'
                        ? 'bg-zinc-700/40 text-zinc-200'
                        : round.status === 'settlement'
                        ? 'bg-purple-500/10 text-purple-200'
                        : 'bg-zinc-800 text-zinc-200'
                    }
                  >
                    {round.status === 'settlement' ? 'Settlement' : round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-zinc-300">{round.summary}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
                  {round.quorum !== undefined && <span>Quorum / {percentLabel(round.quorum)}</span>}
                  {round.startedAt && <span>Start / {formatDate(round.startedAt)}</span>}
                  {round.endedAt && <span>End / {formatDate(round.endedAt)}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Budget Meters</h2>
            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-xs text-emerald-200">
              {votesRemaining} vote{votesRemaining === 1 ? '' : 's'} remaining from your tickets
            </div>
          </div>

          {categoryOrder.map((category) => {
            const items = groupedItems[category]
            if (!items.length) return null
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-100">{categoryLabels[category]}</h3>
                  <span className="text-xs uppercase tracking-wide text-zinc-500">
                    {items.filter((item) => item.locked).length} locked / {items.length - items.filter((item) => item.locked).length} open
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((item) => {
                    const progress = Math.min(100, Math.round((item.pledged / Math.max(1, item.target)) * 100))
                    const allocatedVotes = voteAllocations[item.id] ?? 0
                    return (
                      <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/20 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-zinc-100">{item.name}</div>
                            <p className="mt-1 text-sm text-zinc-300">{item.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={item.locked ? 'bg-emerald-500/10 text-emerald-200' : 'bg-zinc-800 text-zinc-200'}>
                              {item.locked ? 'Locked-in' : 'Open'}
                            </Badge>
                            <Badge className="bg-purple-500/10 text-purple-200">
                              {item.round.charAt(0).toUpperCase() + item.round.slice(1)} round
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Progress value={progress} className="h-2" />
                          <div className="mt-2 flex justify-between text-xs text-zinc-400">
                            <span>{formatCurrency(item.pledged, selectedEvent.ticket.currency)}</span>
                            <span>Target {formatCurrency(item.target, selectedEvent.ticket.currency)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3 text-xs text-zinc-400">
                          <span>Community votes / {item.votes.toLocaleString()}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={allocatedVotes <= 0}
                              onClick={() => handleRemoveVote(item.id)}
                              className="bg-transparent text-zinc-200 hover:bg-white/5"
                            >
                              -1 vote
                            </Button>
                            <Button
                              size="sm"
                              disabled={votesRemaining <= 0}
                              onClick={() => handleAllocateVote(item.id)}
                            >
                              +1 vote
                            </Button>
                          </div>
                        </div>
                        {allocatedVotes > 0 && (
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
                            You assigned {allocatedVotes} vote{allocatedVotes === 1 ? '' : 's'} here. Adjust before the
                            round closes.
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-zinc-100">Ticket Wallet Simulator</h2>
              <div className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                Entrance requires {selectedEvent.ticket.entranceThreshold} tickets
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              Buy or refund tickets to see how many votes you can steer. Full refunds trigger instantly if the next round
              restarts.
            </p>

            <div className="mt-5 grid gap-4 rounded-2xl border border-zinc-800/60 bg-black/30 p-5 md:grid-cols-2">
              <div>
                <div className="text-sm text-zinc-400">Tickets you hold</div>
                <div className="mt-2 text-3xl font-semibold text-zinc-100">{ticketsHeld}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {formatCurrency(ticketsHeld * selectedEvent.ticket.price, selectedEvent.ticket.currency)} staked / {votesRemaining} votes free
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefundTicket}
                  disabled={ticketsHeld === 0}
                  className="bg-transparent text-zinc-200 hover:bg-white/5"
                >
                  Refund ticket
                </Button>
                <Button size="sm" onClick={handleBuyTicket}>
                  Buy ticket
                </Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-xs text-zinc-400 md:grid-cols-2">
              <div>Refunds return funds to the same wallet or account used during purchase.</div>
              <div>Reassign your votes any time before settlement; locked items stay funded for the next round.</div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-zinc-100">Profit Sharing Preview</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Surplus after costs distributes automatically across every ticket. No speculation - distribution mirrors
              your share of tickets held at settlement.
            </p>
            <div className="mt-4 space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
              <div className="flex items-center justify-between">
                <span>Projected surplus</span>
                <span>{formatCurrency(projectedSurplus, selectedEvent.ticket.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-100/80">
                <span>Your share with {ticketsHeld} ticket{ticketsHeld === 1 ? '' : 's'}</span>
                <span>{formatCurrency(yourProjectedShare, selectedEvent.ticket.currency)}</span>
              </div>
              <div className="text-xs text-emerald-100/70">
                Settlement verifies artist performances on-site before final payouts. Any no-shows push their budget
                back into the community surplus.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-zinc-100">Transparency Stack</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Event treasuries live on-chain. Each round checkpoints costs, vote counts, and payouts so the community can
              audit where every ticket flows.
            </p>
            <ul className="mt-4 space-y-4">
              {selectedEvent.transparency.map((entry) => (
                <li key={entry.label} className="rounded-2xl border border-zinc-800/60 bg-black/30 p-4">
                  <div className="text-sm font-semibold text-zinc-100">{entry.label}</div>
                  <div className="mt-1 text-sm text-zinc-300">{entry.value}</div>
                  {entry.detail && <div className="mt-1 text-xs text-zinc-400">{entry.detail}</div>}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-zinc-100">Refund Logic</h2>
            <p className="mt-2 text-sm text-zinc-300">{selectedEvent.refunds.policy}</p>
            <div className="mt-4 rounded-2xl border border-zinc-800/60 bg-black/30 p-4 text-xs text-zinc-400">
              {selectedEvent.refunds.note}
            </div>
            <div className="mt-4 text-xs text-zinc-400">
              Settlements publish a final ledger verifying artist performance, crew payouts, and refunds. Anyone can
              verify the history from the round hashes.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
