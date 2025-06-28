'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Plus, Calendar, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  name: string
  description?: string | null
  productName: string
  industry: string
  updatedAt: Date
  generatedContent: Array<{
    id: string
    type: string
    status: string
  }>
}

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <FolderOpen className="h-5 w-5 mr-2" />
          Recent Projects
        </CardTitle>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first marketing project to get started with AI-powered content generation.
            </p>
            <Link href="/dashboard/create">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/dashboard/projects/${project.id}`}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.productName}</p>
                      </div>
                      <Badge variant="secondary">{project.industry}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {project.generatedContent.length} content pieces
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}