import React from 'react'

export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="lera logo">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="60%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="b" /></feMerge>
        </filter>
      </defs>
      <rect x="6" y="40" width="52" height="2" fill="url(#g)" opacity="0.6" />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6
        const angle = Math.PI * (1 + t)
        const r = 18
        const cx = 32 + r * Math.cos(angle)
        const cy = 42 + r * Math.sin(angle)
        return <circle key={i} cx={cx} cy={cy} r="2" fill="url(#g)" filter="url(#glow)" />
      })}
      <path d="M14 42 C22 32, 42 32, 50 42" fill="none" stroke="url(#g)" strokeOpacity="0.35" />
      <path d="M18 42 C25 35, 39 35, 46 42" fill="none" stroke="url(#g)" strokeOpacity="0.25" />
    </svg>
  )
}

export function LogoWordmark({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-xl font-semibold tracking-tight lowercase">lera</span>
      <span className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-700 to-emerald-900">
        <span className="absolute inset-0 rounded-full blur-[2px] bg-gradient-to-tr from-emerald-600 via-emerald-700 to-emerald-900" />
      </span>
    </div>
  )
}
