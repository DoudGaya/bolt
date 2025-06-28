import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s - AI Marketing Assistant',
    default: 'AI Marketing Assistant - Create Stunning Marketing Content with AI',
  },
  description: 'Transform your marketing strategy with AI-powered content generation. Create professional text, images, audio, and video content that engages your audience and drives results.',
  keywords: ['AI marketing', 'content generation', 'marketing automation', 'AI copywriting', 'digital marketing', 'marketing tools'],
  authors: [{ name: 'AI Marketing Assistant Team' }],
  creator: 'AI Marketing Assistant',
  publisher: 'AI Marketing Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}