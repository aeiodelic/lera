import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json()
    if (!message || !signature) {
      return NextResponse.json({ error: 'Missing message or signature' }, { status: 400 })
    }
    const cookieStore = cookies()
    const nonceCookie = cookieStore.get('siwe_nonce')
    if (!nonceCookie?.value) {
      return NextResponse.json({ error: 'Missing nonce' }, { status: 400 })
    }
    const url = new URL(request.url)
    const host = request.headers.get('x-forwarded-host') || url.host

    const msg = new SiweMessage(message)
    const result = await msg.verify({ signature, domain: host, nonce: nonceCookie.value })
    if (!result.success) {
      return NextResponse.json({ error: 'SIWE verification failed' }, { status: 400 })
    }
    const res = NextResponse.json({ ok: true, address: msg.address })
    // Set a short-lived cookie with the verified address (for client-side convenience)
    res.cookies.set('siwe_address', msg.address.toLowerCase(), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    // Clear nonce to prevent replay
    res.cookies.set('siwe_nonce', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}

