'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { appBaseUrl, supabaseReady, getSupabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      if (!supabaseReady) throw new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${appBaseUrl}/auth/callback`,
          queryParams: { prompt: 'consent' },
        },
      })
      if (error) throw error
      // Redirect handled by provider flow
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to start Google sign-in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
        <div className="mb-4 text-center">
          <div className="text-2xl font-semibold tracking-tight">Create your account</div>
          <div className="text-sm text-zinc-400">Continue with Google to register</div>
        </div>
        <Button onClick={signInWithGoogle} disabled={loading} className="w-full">
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </Button>
        <div className="mt-3 text-center text-xs text-zinc-500">
          By continuing you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
