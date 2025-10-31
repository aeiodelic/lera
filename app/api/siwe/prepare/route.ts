import { NextResponse } from 'next/server'
import { SiweMessage, generateNonce } from 'siwe'

export async function POST(request: Request) {
  const { address, chainId } = await request.json()
  if (!address || !chainId) {
    return NextResponse.json({ error: 'Missing address or chainId' }, { status: 400 })
  }
  const url = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || url.host
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`

  const nonce = generateNonce()
  const msg = new SiweMessage({
    domain: host,
    address,
    statement: 'Sign in to LAcra',
    uri: origin,
    version: '1',
    chainId: Number(chainId),
    nonce,
  })

  const res = NextResponse.json({ message: msg.prepareMessage() })
  res.cookies.set('siwe_nonce', nonce, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })
  return res
}

