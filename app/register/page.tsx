'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { appBaseUrl, supabaseReady, getSupabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  const loginWithMetaMask = async () => {
    try {
      const eth = (window as any).ethereum
      if (!eth) return alert('No wallet found. Please install MetaMask.')
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      const addr = (accounts?.[0] || '').toLowerCase()
      if (!addr) return
      const chainIdHex: string = await eth.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      const prep = await fetch('/api/siwe/prepare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: addr, chainId }) }).then(r => r.json())
      if (!prep?.message) throw new Error('Failed to prepare SIWE message')
      const signature: string = await eth.request({ method: 'personal_sign', params: [prep.message, addr] })
      const verify = await fetch('/api/siwe/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: prep.message, signature }) }).then(r => r.json())
      if (!verify?.ok) throw new Error(verify?.error || 'SIWE verification failed')
      if (supabaseReady) {
        const { data } = await getSupabase().auth.getUser()
        const userId = data?.user?.id
        if (userId) {
          await getSupabase().from('profiles').update({ wallet_address: addr }).eq('id', userId)
          alert('Wallet verified and linked to your profile.')
          return
        }
      }
      alert('Wallet verified. Now continue with Google to create/link your account.')
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'MetaMask login failed')
    }
  }

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
        <div className="my-2 text-center text-xs text-zinc-500">or</div>
        <Button onClick={loginWithMetaMask} variant="secondary" className="w-full">Login with MetaMask</Button>
        <div className="mt-3 text-center text-xs text-zinc-500">
          By continuing you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
