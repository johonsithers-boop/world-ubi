import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MiniKitProvider } from '@/components/providers/MiniKitProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'World UBI Coin',
  description: 'Universal Basic Income for Everyone - Earn passive income through World ID verification',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 min-h-screen">
        <MiniKitProvider>
          {children}
        </MiniKitProvider>
      </body>
    </html>
  )
}
