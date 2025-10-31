
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const appBaseUrl = (process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey)

let _client: SupabaseClient | null = null
export function getSupabase(): SupabaseClient {
  if (_client) return _client
  if (!supabaseReady) {
    throw new Error('Supabase env not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

// Backward export to avoid import errors in files that expect `supabase`
export const supabase = new Proxy({} as any, {
  get() {
    // Lazy-init so existing code keeps working, but throws a clear message if misconfigured
    return (getSupabase() as any)
  }
}) as SupabaseClient
