'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Plus,
  Minus,
  Calendar as CalendarIcon,
  Target,
  Sparkles,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Music,
  Globe,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  Settings,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { generateCampaignContent } from '@/actions/content-generation'

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Please select a project'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  contentTypes: z.array(z.string()).min(1, 'Select at least one content type'),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  budget: z.string().optional(),
  contentVolume: z.object({
    daily: z.number().min(1).max(10),
    weekly: z.number().min(1).max(50),
    total: z.number().min(1).max(200),
  }),
  optimization: z.object({
    abTesting: z.boolean(),
    seoFocus: z.boolean(),
    accessibility: z.boolean(),
    brandConsistency: z.boolean(),
  }),
})

type CampaignFormData = z.infer<typeof campaignSchema>

interface CampaignBuilderProps {
  projects: any[]
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻' },
]

const contentTypes = [
  { id: 'TEXT', name: 'Text Content', icon: MessageSquare, description: 'Posts, captions, articles' },
  { id: 'IMAGE', name: 'Visual Content', icon: ImageIcon, description: 'Graphics, photos, infographics' },
  { id: 'VIDEO', name: 'Video Content', icon: Video, description: 'Short videos, reels, stories' },
  { id: 'AUDIO', name: 'Audio Content', icon: Music, description: 'Voiceovers, podcasts, jingles' },
]

const campaignGoals = [
  { id: 'awareness', name: 'Brand Awareness', icon: '🎯' },
  { id: 'engagement', name: 'Engagement', icon: '💬' },
  { id: 'traffic', name: 'Website Traffic', icon: '🔗' },
  { id: 'leads', name: 'Lead Generation', icon: '📧' },
  { id: 'sales', name: 'Sales & Conversions', icon: '💰' },
  { id: 'retention', name: 'Customer Retention', icon: '🔄' },
]

export function CampaignBuilder({ projects }: CampaignBuilderProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState(1)
  const [generationProgress, setGenerationProgress] = useState(0)

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      platforms: [],
      contentTypes: [],
      goals: [],
      contentVolume: {
        daily: 2,
        weekly: 10,
        total: 30,
      },
      optimization: {
        abTesting: true,
        seoFocus: true,
        accessibility: false,
        brandConsistency: true,
      },
    },
  })

  const watchedValues = form.watch()

  const onSubmit = async (data: CampaignFormData) => {
    try {
      setIsGenerating(true)
      setGenerationProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Generate campaign content using the server action
      const result = await generateCampaignContent(data)

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (result.success) {
        toast.success(`Campaign "${data.name}" created successfully with ${result.contentCount} pieces of content!`)
        router.push('/dashboard/campaigns')
      } else {
        toast.error(result.error || 'Failed to create campaign')
      }
    } catch (error) {
      console.error('Campaign generation error:', error)
      toast.error('An error occurred while creating the campaign')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const calculateEstimatedContent = () => {
    const days = Math.ceil((watchedValues.endDate?.getTime() - watchedValues.startDate?.getTime()) / (1000 * 60 * 60 * 24)) || 30
    const contentPerDay = watchedValues.contentVolume?.daily || 2
    const platforms = watchedValues.platforms?.length || 1
    const contentTypes = watchedValues.contentTypes?.length || 1
    
    return Math.min(days * contentPerDay * platforms * contentTypes, 200)
  }

  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3, 4].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              stepNumber <= currentStep
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-500"
            )}
          >
            {stepNumber}
          </div>
          {stepNumber < 4 && (
            <div
              className={cn(
                "w-12 h-1 mx-2",
                stepNumber < currentStep ? "bg-purple-600" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )

  if (isGenerating) {
    return (
      <div className="text-center py-12 space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-16 w-16 text-purple-600 mx-auto" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Creating Your Campaign</h3>
          <p className="text-muted-foreground">
            Generating {calculateEstimatedContent()} pieces of content across {watchedValues.platforms?.length} platforms...
          </p>
        </div>
        <div className="max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{generationProgress}% complete</p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="step1"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Campaign Basics</h2>
                <p className="text-muted-foreground">
                  Set up the foundation of your marketing campaign
                </p>
              </div>

              <div className="grid gap-6 max-w-2xl mx-auto">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Q4 Holiday Promotion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your campaign goals and strategy..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Project</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a project for this campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name} ({project.productName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < (watchedValues.startDate || new Date())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)}>
                  Next: Platforms & Content
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="step2"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Platforms & Content Types</h2>
                <p className="text-muted-foreground">
                  Choose where to publish and what types of content to create
                </p>
              </div>

              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Platforms Selection */}
                <FormField
                  control={form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Target Platforms</FormLabel>
                      <FormDescription>
                        Select the social media platforms for your campaign
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {platforms.map((platform) => (
                          <div key={platform.id}>
                            <label className="cursor-pointer">
                              <div
                                className={cn(
                                  "flex flex-col items-center p-4 border-2 rounded-lg transition-all",
                                  field.value?.includes(platform.id)
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                <span className="text-2xl mb-2">{platform.icon}</span>
                                <span className="text-sm font-medium">{platform.name}</span>
                                <Checkbox
                                  checked={field.value?.includes(platform.id)}
                                  onCheckedChange={(checked) => {
                                    const currentPlatforms = field.value || []
                                    if (checked) {
                                      field.onChange([...currentPlatforms, platform.id])
                                    } else {
                                      field.onChange(
                                        currentPlatforms.filter((p) => p !== platform.id)
                                      )
                                    }
                                  }}
                                  className="mt-2"
                                />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Types Selection */}
                <FormField
                  control={form.control}
                  name="contentTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Content Types</FormLabel>
                      <FormDescription>
                        Choose what types of content to generate
                      </FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentTypes.map((contentType) => (
                          <div key={contentType.id}>
                            <label className="cursor-pointer">
                              <div
                                className={cn(
                                  "flex items-center p-4 border-2 rounded-lg transition-all",
                                  field.value?.includes(contentType.id)
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                <contentType.icon className="h-6 w-6 mr-3 text-purple-600" />
                                <div className="flex-1">
                                  <div className="font-medium">{contentType.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {contentType.description}
                                  </div>
                                </div>
                                <Checkbox
                                  checked={field.value?.includes(contentType.id)}
                                  onCheckedChange={(checked) => {
                                    const currentTypes = field.value || []
                                    if (checked) {
                                      field.onChange([...currentTypes, contentType.id])
                                    } else {
                                      field.onChange(
                                        currentTypes.filter((t) => t !== contentType.id)
                                      )
                                    }
                                  }}
                                />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Next: Goals & Audience
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="step3"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Goals & Audience</h2>
                <p className="text-muted-foreground">
                  Define your campaign objectives and target audience
                </p>
              </div>

              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Campaign Goals */}
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Campaign Goals</FormLabel>
                      <FormDescription>
                        What do you want to achieve with this campaign?
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {campaignGoals.map((goal) => (
                          <div key={goal.id}>
                            <label className="cursor-pointer">
                              <div
                                className={cn(
                                  "flex items-center p-4 border-2 rounded-lg transition-all",
                                  field.value?.includes(goal.id)
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                <span className="text-xl mr-3">{goal.icon}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{goal.name}</div>
                                </div>
                                <Checkbox
                                  checked={field.value?.includes(goal.id)}
                                  onCheckedChange={(checked) => {
                                    const currentGoals = field.value || []
                                    if (checked) {
                                      field.onChange([...currentGoals, goal.id])
                                    } else {
                                      field.onChange(
                                        currentGoals.filter((g) => g !== goal.id)
                                      )
                                    }
                                  }}
                                />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Audience */}
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormDescription>
                        Describe your ideal audience for this campaign
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Tech-savvy millennials aged 25-35, interested in sustainable products, active on social media..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Budget (Optional) */}
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (Optional)</FormLabel>
                      <FormDescription>
                        Campaign budget for reference and optimization
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="e.g., $5,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(4)}>
                  Next: Volume & Settings
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="step4"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Content Volume & Optimization</h2>
                <p className="text-muted-foreground">
                  Configure content generation volume and optimization settings
                </p>
              </div>

              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Content Volume */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Content Volume
                    </CardTitle>
                    <CardDescription>
                      Set how much content to generate for your campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="contentVolume.daily"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Per Day</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contentVolume.weekly"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Per Week</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="50"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contentVolume.total"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Limit</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="200"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">Estimated Output</span>
                      </div>
                      <p className="text-blue-700 mt-1">
                        Approximately <strong>{calculateEstimatedContent()}</strong> pieces of content will be generated for this campaign.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Optimization Settings
                    </CardTitle>
                    <CardDescription>
                      Advanced settings to enhance your content performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="optimization.abTesting"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">A/B Testing</FormLabel>
                            <FormDescription>
                              Generate multiple variations for testing
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="optimization.seoFocus"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">SEO Optimization</FormLabel>
                            <FormDescription>
                              Optimize content for search engines
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="optimization.accessibility"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Accessibility Focus</FormLabel>
                            <FormDescription>
                              Ensure content is accessible to all users
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="optimization.brandConsistency"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Brand Consistency</FormLabel>
                            <FormDescription>
                              Maintain consistent brand voice and style
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  )
}
