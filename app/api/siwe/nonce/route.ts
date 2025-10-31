import { NextResponse } from 'next/server'
import { generateNonce } from 'siwe'

export async function GET(request: Request) {
  const nonce = generateNonce()
  const res = NextResponse.json({ nonce })
  res.cookies.set('siwe_nonce', nonce, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })
  return res
}

