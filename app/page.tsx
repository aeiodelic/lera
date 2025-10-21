'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Ticket, Vote as VoteIcon, Wallet, Music2, Users, Sparkles, Gauge, Coins, Info, ExternalLink, QrCode, Calendar, Camera, Globe, Share2, MessageSquareHeart, Plus, Star, Lock, ReceiptText, HandCoins, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

import { supabase } from '@/lib/supabase'

const brand = {
  bg: 'bg-gradient-to-b from-[#0b0f1a] via-[#0b0f1a] to-[#0b0f1a]',
  accent: 'from-fuchsia-500 via-cyan-400 to-emerald-400',
  glow: 'shadow-[0_0_40px_rgba(56,189,248,0.3)]',
};

function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="Léra logo">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="b" /></feMerge>
        </filter>
      </defs>
      <path d="M6 42h52" stroke="url(#g)" strokeWidth="2" opacity="0.6"/>
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const angle = Math.PI * (1 + t);
        const r = 18;
        const cx = 32 + r * Math.cos(angle);
        const cy = 42 + r * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="2" fill="url(#g)" filter="url(#glow)" />;
      })}
      <path d="M14 42 C20 34, 44 34, 50 42" fill="none" stroke="url(#g)" strokeOpacity="0.35" />
      <path d="M18 42 C24 36, 40 36, 46 42" fill="none" stroke="url(#g)" strokeOpacity="0.25" />
    </svg>
  )
}

function LogoWordmark({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-xl font-semibold tracking-tight">L</span>
      <span className="relative text-xl font-semibold tracking-tight">
        <span>é</span>
        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-fuchsia-500 via-cyan-400 to-emerald-400 blur-[1px]" />
      </span>
      <span className="text-xl font-semibold tracking-tight">ra</span>
    </div>
  )
}

const TABS = [
  { id: 'events', label: 'Events', icon: Music2 },
  { id: 'fund', label: 'Fund & Tickets', icon: Ticket },
  { id: 'vote', label: 'Vote', icon: VoteIcon },
  { id: 'treasury', label: 'Treasury', icon: Wallet },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'about', label: 'About', icon: Info },
]

function NavItem({ label, icon: Icon, active, onClick }: any) {
  const base = 'relative gap-2 text-sm md:text-base font-medium transition-all rounded-xl px-3 md:px-4 py-2 inline-flex items-center';
  const activeStyles = 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-white/20';
  const inactiveStyles = 'text-zinc-300 hover:bg-white/5 hover:text-white';
  return <button onClick={onClick} className={`${base} ${active ? activeStyles : inactiveStyles}`}><Icon size={18}/>{label}</button>
}

const mockEvent = {
  id: 'lera-0',
  title: 'Léra Genesis #0',
  status: 'Funding',
  location: 'Santa Marta → Tayrona area',
  date: 'Q1 2026 (TBD by vote)',
  target: 20000,
  raised: 7680,
  ticketsSold: 384,
  ticketsCap: 1000,
  quorum: 35,
  tags: ['Open-air', 'Transparent budget', 'Decentralized'],
  pricing: [
    { tier: 'Early Bird', price: 18, left: 120, total: 200 },
    { tier: 'Standard', price: 25, left: 540, total: 600 },
    { tier: 'Late', price: 35, left: 200, total: 200 },
  ],
  artists: [
    { name: 'Kindzadza', support: 62 },
    { name: 'Ajja', support: 24 },
    { name: 'Earthling', support: 14 },
  ],
};

function Stat({ label, value, suffix }: any) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-lg font-semibold tracking-tight">{value} {suffix}</div>
    </div>
  )
}

function MiniSplit({ label, pct, amount }: any) {
  return (
    <div className="rounded-xl border border-zinc-800/60 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <Progress value={pct} className="mt-2 h-2" />
      <div className="mt-2 text-sm text-zinc-300">${amount.toLocaleString()}</div>
    </div>
  )
}

const Meter = ({ value }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">Target progress</span>
      <span className="font-semibold">{value}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
);

function EventHero({ e }: any) {
  const progress = Math.round((e.raised / e.target) * 100);
  return (
    <section className="relative overflow-hidden">
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b ${brand.accent} opacity-[0.12] blur-3xl`} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-bold leading-tight md:text-5xl">
            <span className="bg-gradient-to-tr from-fuchsia-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Léra</span> — Freedom in Motion
          </motion.h1>
          <p className="max-w-prose text-lg text-zinc-300">
            The open protocol for community-funded live events. Buy tickets with stablecoins, vote the lineup, and watch the budget meter fill in real time — transparent, decentralized, and fair.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2"><Sparkles size={18}/> Explore Events</Button>
            <Button size="lg" variant="secondary" className="gap-2"><Gauge size={18}/> How it works</Button>
          </div>
          <div className="mt-2 text-sm text-zinc-400">Chain: Base • Stablecoin: USDC • Votes: Snapshot • Storage: Supabase</div>
        </div>
        <div className="grid gap-4 md:pl-8">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
            <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
              <div className="text-xl font-semibold">{e.title}</div>
              <Badge className="bg-purple-500/10 text-purple-300">Funding</Badge>
            </div>
            <div className="p-4 space-y-4">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-zinc-800/60">
                <div className={`h-full w-full ${brand.glow} bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.25),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,.25),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,.2),transparent_30%)]`} />
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat label="Tickets sold" value={`${e.ticketsSold}`} suffix={`/ ${e.ticketsCap}`} />
                <Stat label="Treasury" value={`$${e.raised.toLocaleString()}`} />
                <Stat label="Deadline" value="Nov 30, 2025" />
                <Stat label="Quorum" value={`${e.quorum}%`} />
              </div>
              <Meter value={progress} />
              <div className="flex flex-wrap gap-2">{e.tags.map((t: string) => <Badge key={t} className="bg-zinc-800 text-zinc-200">{t}</Badge>)}</div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" className="gap-2"><Ticket size={18}/> Buy Ticket</Button>
                <Button size="lg" variant="secondary" className="gap-2"><VoteIcon size={18}/> Vote Line-up</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VoteCard({ artists = mockEvent.artists }: any) {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
      <div className="p-4 border-b border-zinc-800/60">
        <div className="text-xl font-semibold">Artist Voting</div>
        <div className="text-sm text-zinc-400">1 ticket = 1 vote • Gasless via Snapshot</div>
      </div>
      <div className="p-4 grid gap-3 md:grid-cols-3">
        {artists.map((a: any) => (
          <div key={a.name} className="space-y-2 rounded-xl border border-zinc-800/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{a.name}</span>
              <Badge className="bg-zinc-800 text-zinc-200">{a.support}%</Badge>
            </div>
            <Progress value={a.support} className="h-2" />
            <Button className="w-full">Vote {a.name}</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  const [active, setActive] = useState<string>('events');
  const [passOpen, setPassOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className={`${brand.bg} min-h-screen text-zinc-100`}>
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <LogoWordmark />
            <Badge className="ml-2 bg-emerald-500/15 text-emerald-300">beta</Badge>
          </div>
          <nav className="hidden items-center justify-center gap-1 md:flex">
            {TABS.map((t) => (
              <NavItem key={t.id} label={t.label} icon={t.icon} active={active === t.id} onClick={() => setActive(t.id)} />
            ))}
          </nav>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setPassOpen(true)}>My Pass</Button>
            <Button variant="secondary" onClick={() => setProfileOpen(true)}>Profile</Button>
            <Button variant="ghost" className="md:hidden"><Menu /></Button>
          </div>
        </div>
      </header>

      {active === 'events' && (
        <>
          <EventHero e={mockEvent} />
          <main className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <VoteCard />
              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                <div className="text-lg font-semibold">Treasury & Splits</div>
                <div className="text-sm text-zinc-400">Fully transparent, auto-escrowed payouts</div>
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                <div className="text-lg font-semibold">Why this UI (not a DEX)</div>
                <div className="text-sm text-zinc-300 mt-2">Attendee-first nav, live meters & splits, gasless votes.</div>
              </div>
            </aside>
          </main>
        </>
      )}

      <footer className="border-t border-zinc-800/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="text-sm text-zinc-400">© {new Date().getFullYear()} Léra • Open source</div>
          <div className="flex items-center gap-3">
            <Badge className="bg-zinc-800 text-zinc-200">Base</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">USDC</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">Snapshot</Badge>
            <Badge className="bg-zinc-800 text-zinc-200">Supabase</Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}