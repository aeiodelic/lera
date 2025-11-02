"use client"

import React, { createContext, useContext } from 'react'

type TabsContextValue = {
  value: string
  onChange?: (v: string) => void
}

const TabsCtx = createContext<TabsContextValue | null>(null)

export function Tabs({ value, onValueChange, className, children }: { value: string; onValueChange?: (v: string) => void; className?: string; children?: React.ReactNode }) {
  return (
    <TabsCtx.Provider value={{ value, onChange: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children?: React.ReactNode }) {
  const base = "inline-flex rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-1"
  return <div className={[base, className].filter(Boolean).join(' ')}>{children}</div>
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children?: React.ReactNode }) {
  const ctx = useContext(TabsCtx)
  if (!ctx) return null
  const active = ctx.value === value
  const base = "px-4 py-2 rounded-lg text-sm font-medium"
  const activeCls = active ? "bg-zinc-800 text-white" : "text-zinc-300 hover:text-white"
  return (
    <button className={[base, activeCls, className].filter(Boolean).join(' ')} onClick={() => ctx.onChange?.(value)}>
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children?: React.ReactNode }) {
  const ctx = useContext(TabsCtx)
  if (!ctx || ctx.value !== value) return null
  return <div className={className}>{children}</div>
}

