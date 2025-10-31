'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, appBaseUrl } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrivy } from '@privy-io/react-auth'

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
  const { login, user: privyUser, ready: privyReady } = usePrivy()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      const u = data?.user ?? null
      setUserId(u?.id ?? null)
      setEmail(u?.email ?? null)
      if (u?.id) {
        let p: any = null
        const sel = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle()
        if (sel.data) {
          p = sel.data
        } else {
          // Backfill missing profile if trigger didn't run yet
          const ins = await supabase.from('profiles').insert({ id: u.id }).select().single()
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
    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      if (!session) {
        setUserId(null); setEmail(null); setProfile(null)
      } else {
        setUserId(session.user.id); setEmail(session.user.email)
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${appBaseUrl}/auth/callback`, queryParams: { prompt: 'consent' } },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const saveProfile = async () => {
    if (!userId) return
    try {
      setSaving(true)
      const { error } = await supabase.from('profiles').update({ username }).eq('id', userId)
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
      setWalletAddress(addr)
      if (!userId) return
      const { error } = await supabase.from('profiles').update({ wallet_address: addr }).eq('id', userId)
      if (error) throw error
      setProfile((p) => p ? { ...p, wallet_address: addr } : p)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to connect wallet')
    }
  }

  const usePrivyWallet = async () => {
    try {
      if (!login) {
        alert('Privy is not configured. Set NEXT_PUBLIC_PRIVY_APP_ID.')
        return
      }
      await login()
      const u: any = privyUser as any
      const addr = u?.wallet?.address || (u?.linkedAccounts || []).find((a: any) => a.type === 'wallet')?.address
      if (!addr) {
        alert('No Privy wallet address found.')
        return
      }
      const lower = String(addr).toLowerCase()
      setWalletAddress(lower)
      if (!userId) return
      const { error } = await supabase.from('profiles').update({ wallet_address: lower }).eq('id', userId)
      if (error) throw error
      setProfile((p) => p ? { ...p, wallet_address: lower } : p)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Privy login failed')
    }
  }

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
            <Button variant="secondary" onClick={usePrivyWallet}>Use Privy Wallet</Button>
          </div>
          {!process.env.NEXT_PUBLIC_PRIVY_APP_ID && (
            <div className="text-xs text-zinc-500">Set NEXT_PUBLIC_PRIVY_APP_ID to enable Privy.</div>
          )}
        </div>
      </div>
    </div>
  )
}
