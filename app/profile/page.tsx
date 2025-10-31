'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { appBaseUrl, supabaseReady, getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Profile = {
  id: string
  username: string | null
  avatar_url: string | null
  wallet_address: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (!supabaseReady) throw new Error('Supabase not configured')
      const { data } = await getSupabase().auth.getUser()
      const u = data?.user ?? null
      setUserId(u?.id ?? null)
      setEmail(u?.email ?? null)
      if (u?.id) {
        let p: any = null
        const sel = await getSupabase().from('profiles').select('*').eq('id', u.id).maybeSingle()
        if (sel.data) {
          p = sel.data
        } else {
          // Backfill missing profile if trigger didn't run yet
          const ins = await getSupabase().from('profiles').insert({ id: u.id }).select().single()
          if (!ins.error) p = ins.data
        }
        if (p) {
          setProfile(p)
          setUsername(p.username ?? '')
          setWalletAddress(p.wallet_address ?? '')
        }
      }
      setLoading(false)
    }
    init()
    const { data: sub } = getSupabase().auth.onAuthStateChange((_e: any, session: any) => {
      if (!session) {
        setUserId(null); setEmail(null); setProfile(null)
      } else {
        setUserId(session.user.id); setEmail(session.user.email)
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const signInWithGoogle = async () => {
    if (!supabaseReady) return alert('Supabase not configured')
    await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${appBaseUrl}/auth/callback`, queryParams: { prompt: 'consent' } },
    })
  }

  const signOut = async () => {
    if (!supabaseReady) return
    await getSupabase().auth.signOut()
    router.refresh()
  }

  const saveProfile = async () => {
    if (!userId) return
    try {
      setSaving(true)
      const { error } = await getSupabase().from('profiles').update({ username }).eq('id', userId)
      if (error) throw error
      setProfile((p) => p ? { ...p, username } : p)
    } catch (err: any) {
      alert(err?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const connectWallet = async () => {
    try {
      const eth = (window as any).ethereum
      if (!eth) {
        alert('No wallet found. Please install MetaMask.')
        return
      }
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      const addr = (accounts?.[0] || '').toLowerCase()
      if (!addr) return
      const chainIdHex: string = await eth.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)

      // Prepare SIWE message on server
      const prep = await fetch('/api/siwe/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, chainId }),
      }).then(r => r.json())
      if (!prep?.message) throw new Error('Failed to prepare SIWE message')

      // Sign message with MetaMask
      const signature: string = await eth.request({
        method: 'personal_sign',
        params: [prep.message, addr],
      })

      // Verify on server
      const verify = await fetch('/api/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prep.message, signature }),
      }).then(r => r.json())
      if (!verify?.ok) throw new Error(verify?.error || 'SIWE verification failed')

      setWalletAddress(addr)
      if (!userId) {
        alert('Wallet verified. Sign in to link it to your account.')
        return
      }
      const { error } = await getSupabase().from('profiles').update({ wallet_address: addr }).eq('id', userId)
      if (error) throw error
      setProfile((p) => p ? { ...p, wallet_address: addr } : p)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to connect wallet')
    }
  }

  // Privy wallet removed per request

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
        <div className="text-sm text-zinc-400">Loading…</div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
          <div className="mb-4 text-center">
            <div className="text-2xl font-semibold tracking-tight">Welcome</div>
            <div className="text-sm text-zinc-400">Sign in to access your profile</div>
          </div>
          <Button onClick={signInWithGoogle} className="w-full">Continue with Google</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold tracking-tight">Your Profile</div>
            <div className="text-sm text-zinc-400">{email}</div>
          </div>
          <Button variant="secondary" onClick={signOut}>Sign out</Button>
        </div>

        <div className="grid gap-3">
          <label className="text-sm text-zinc-300">Username</label>
          <Input value={username} onChange={(e: any) => setUsername(e.target.value)} placeholder="e.g. alex" />
          <div>
            <Button onClick={saveProfile} disabled={saving} className="mt-2">{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>

        <div className="grid gap-3">
          <label className="text-sm text-zinc-300">Wallet</label>
          <Input readOnly value={walletAddress || ''} placeholder="Not connected" />
          <div className="flex gap-2">
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
