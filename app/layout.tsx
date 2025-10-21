
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Léra — Freedom in Motion',
  description: 'The open protocol for community-funded live events.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
