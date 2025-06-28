import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for individuals and small businesses',
    features: [
      '50 AI-generated content pieces/month',
      'Basic templates',
      'Email support',
      'Brand kit (1 brand)',
      'HD image downloads'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'Ideal for growing businesses and marketing teams',
    features: [
      '200 AI-generated content pieces/month',
      'Premium templates',
      'Priority support',
      'Brand kit (5 brands)',
      '4K image downloads',
      'Video content generation',
      'Team collaboration (5 users)'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large organizations with advanced needs',
    features: [
      'Unlimited AI-generated content',
      'Custom templates',
      'Dedicated support',
      'Unlimited brands',
      '4K image & video downloads',
      'Advanced analytics',
      'Unlimited team members',
      'API access',
      'White-label options'
    ],
    popular: false
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
