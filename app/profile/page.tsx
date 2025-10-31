'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Profile = {
  id: string
  username: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      const u = data?.user ?? null
      setUserId(u?.id ?? null)
      setEmail(u?.email ?? null)
      if (u?.id) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single()
        if (p) {
          setProfile(p)
          setUsername(p.username ?? '')
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
    const origin = window.location.origin
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback`, queryParams: { prompt: 'consent' } },
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
      </div>
    </div>
  )
}
