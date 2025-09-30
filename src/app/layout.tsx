import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// @ts-ignore Next.js handles global CSS side-effect imports
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agent CRM - Voice AI Integration',
  description: 'Comprehensive CRM system with Voice AI Agent integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}