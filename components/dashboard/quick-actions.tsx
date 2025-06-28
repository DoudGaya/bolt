'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles, Image, MessageSquare, Music, Video } from 'lucide-react'

const quickActions = [
  {
    title: 'New Project',
    description: 'Start a new marketing campaign',
    icon: Plus,
    href: '/dashboard/create',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Generate Content',
    description: 'Create professional marketing content',
    icon: Sparkles,
    href: '/dashboard/generate',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Text Content',
    description: 'Create ad copy and articles',
    icon: MessageSquare,
    href: '/dashboard/generate?type=TEXT',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    title: 'Visual Design',
    description: 'Generate images and graphics',
    icon: Image,
    href: '/dashboard/generate?type=IMAGE',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}