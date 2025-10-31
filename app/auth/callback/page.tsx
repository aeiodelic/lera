'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, supabaseReady } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        if (!supabaseReady) throw new Error('Supabase not configured')
        const { error } = await getSupabase().auth.exchangeCodeForSession(window.location.href)
        if (error) throw error
      } catch (err) {
        console.error('OAuth callback error', err)
      } finally {
        router.replace('/profile')
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="text-sm text-zinc-400">Signing you in…</div>
    </div>
  )
}
