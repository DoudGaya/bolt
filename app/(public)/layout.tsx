import type { Metadata } from 'next'
import { PublicNavigation } from '@/components/public/public-navigation'
import { Toaster } from '@/components/ui/sonner'

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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Marketing Assistant - Create Stunning Marketing Content with AI',
    description: 'Transform your marketing strategy with AI-powered content generation. Create professional text, images, audio, and video content that engages your audience and drives results.',
    siteName: 'AI Marketing Assistant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Marketing Assistant - Create Stunning Marketing Content with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Marketing Assistant - Create Stunning Marketing Content with AI',
    description: 'Transform your marketing strategy with AI-powered content generation. Create professional text, images, audio, and video content that engages your audience and drives results.',
    images: ['/og-image.jpg'],
    creator: '@aimarketingassistant',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <PublicNavigation />
      <main>{children}</main>
      <Toaster />
    </div>
  )
}
