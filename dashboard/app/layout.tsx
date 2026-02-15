import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Team System Dashboard',
  description: 'Simile Replication • OpenClaw Ecosystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Nav */}
        <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-cyan text-xl font-bold">
              Team System
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-400 hover:text-cyan transition-colors">
                Build Progress
              </Link>
              <Link href="/office" className="text-gray-400 hover:text-cyan transition-colors">
                The Office 🏢
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
