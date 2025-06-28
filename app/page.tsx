import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LandingPage } from '@/components/landing-page'
import { JsonLd, websiteSchema, organizationSchema, softwareApplicationSchema } from '@/components/seo/json-ld'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DoudAI - Create Stunning Marketing Content with AI',
  description: 'Transform your marketing strategy with AI-powered content generation. Create professional text, images, audio, and video content that engages your audience and drives results.',
  keywords: ['AI marketing', 'content generation', 'marketing automation', 'AI copywriting', 'digital marketing', 'marketing tools', 'artificial intelligence', 'automated content'],
  openGraph: {
    title: 'DoudAI - Create Stunning Marketing Content with AI',
    description: 'Transform your marketing strategy with AI-powered content generation. Create professional text, images, audio, and video content that engages your audience and drives results.',
    url: '/',
    siteName: 'DoudAI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DoudAI - Create Stunning Marketing Content with AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoudAI - Create Stunning Marketing Content with AI',
    description: 'Transform your marketing strategy with AI-powered content generation. Create professional text, images, audio, and video content that engages your audience and drives results.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  let session = null
  
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Error getting server session:', error)
    // Continue without session if there's an error
  }

  if (session) {
    redirect('/dashboard')
  }

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={softwareApplicationSchema} />
      <LandingPage />
    </>
  )
}