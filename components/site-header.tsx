"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const brand = {
  bg: 'bg-gradient-to-b from-[#0b0f1a] via-[#0b0f1a] to-[#0b0f1a]',
}

export function SiteHeader() {
  const pathname = usePathname()
  const isActive = (p: string) => pathname === p
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/about" className="text-xl font-semibold tracking-tight">LAcra</Link>
          <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300 border border-emerald-500/20">beta</span>
        </div>
        <nav className="hidden items-center justify-center gap-1 md:flex">
          <Link href="/about" className={`relative gap-2 text-sm md:text-base font-medium transition-all rounded-xl px-3 md:px-4 py-2 inline-flex items-center ${isActive('/about') ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-white/20' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>About</Link>
          <Link href="/events" className={`relative gap-2 text-sm md:text-base font-medium transition-all rounded-xl px-3 md:px-4 py-2 inline-flex items-center ${isActive('/events') ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-white/20' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>Events</Link>
        </nav>
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => router.push('/profile')}>Profile</Button>
        </div>
      </div>
    </header>
  )
}

