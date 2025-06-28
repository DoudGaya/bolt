'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { FolderOpen, FileText, Activity, TrendingUp } from 'lucide-react'

interface StatsProps {
  stats: {
    totalProjects: number
    totalContent: number
    recentActivity: number
  }
}

export function DashboardStats({ stats }: StatsProps) {
  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Generated Content',
      value: stats.totalContent,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: Activity,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}