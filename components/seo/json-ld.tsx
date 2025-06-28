interface JsonLdData {
  '@context': string
  '@type': string
  [key: string]: any
}

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationSchema: JsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DoudAI',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  logo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/logo.png`,
  description: 'AI-powered marketing content generation platform',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/aimarketingassistant',
    'https://linkedin.com/company/aimarketingassistant',
  ],
}

export const websiteSchema: JsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  name: 'DoudAI',
  description: 'Create stunning marketing content with AI-powered generation tools',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const softwareApplicationSchema: JsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DoudAI',
  operatingSystem: 'Web Browser',
  applicationCategory: 'BusinessApplication',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    reviewCount: 1250,
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
}
