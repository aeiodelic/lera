import React from 'react'

export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="LAcra logo">
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
        const t = i / 8
        const angle = Math.PI * (1 + t)
        const r = 18
        const cx = 32 + r * Math.cos(angle)
        const cy = 42 + r * Math.sin(angle)
        return <circle key={i} cx={cx} cy={cy} r="2" fill="url(#g)" filter="url(#glow)" />
      })}
      <path d="M14 42 C20 34, 44 34, 50 42" fill="none" stroke="url(#g)" strokeOpacity="0.35" />
      <path d="M18 42 C24 36, 40 36, 46 42" fill="none" stroke="url(#g)" strokeOpacity="0.25" />
    </svg>
  )
}

export function LogoWordmark({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-xl font-semibold tracking-tight">L</span>
      <span className="relative text-xl font-semibold tracking-tight">
        <span>Ac</span>
        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-fuchsia-500 via-cyan-400 to-emerald-400 blur-[1px]" />
      </span>
      <span className="text-xl font-semibold tracking-tight">ra</span>
    </div>
  )
}

