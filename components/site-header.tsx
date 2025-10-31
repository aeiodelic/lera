"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Info, Music2, BarChart2 } from 'lucide-react'
import { LogoMark, LogoWordmark } from '@/components/logo'

export function SiteHeader() {
  const pathname = usePathname()
  const isActive = (p: string) => pathname === p
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <Link href="/about" className="inline-flex items-center gap-2">
            <LogoWordmark />
          </Link>
          <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300 border border-emerald-500/20">beta</span>
        </div>
        <nav className="hidden items-center justify-center gap-1 md:flex">
          <Link href="/about" className={`relative gap-2 text-sm md:text-base font-medium transition-all rounded-xl px-3 md:px-4 py-2 inline-flex items-center ${isActive('/about') ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-white/20' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>
            <Info size={18} /> About
          </Link>
          <Link href="/events" className={`relative gap-2 text-sm md:text-base font-medium transition-all rounded-xl px-3 md:px-4 py-2 inline-flex items-center ${isActive('/events') ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-white/20' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>
            <Music2 size={18} /> Events
          </Link>
          <Link href="/stats" className={`relative gap-2 text-sm md:text-base font-medium transition-all rounded-xl px-3 md:px-4 py-2 inline-flex items-center ${isActive('/stats') ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-white/20' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>
            <BarChart2 size={18} /> Stats
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => router.push('/profile')}>Profile</Button>
        </div>
      </div>
    </header>
  )
}
