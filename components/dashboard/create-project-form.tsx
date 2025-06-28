'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Palette,
  Target,
  Sparkles,
  Building,
  Users,
  MessageSquare,
  Image,
  Video,
  Music,
  FileText,
  Globe,
  Briefcase,
} from 'lucide-react'
import { createProjectSchema, type CreateProjectData } from '@/lib/validations'
import { ColorPicker } from '@/components/ui/color-picker'

const steps = [
  {
    id: 'basic',
    title: 'Project Basics',
    description: 'Name and describe your project',
    icon: Briefcase,
  },
  {
    id: 'brand',
    title: 'Brand Information',
    description: 'Tell us about your brand or product',
    icon: Building,
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Define your audience and messaging',
    icon: Users,
  },
  {
    id: 'style',
    title: 'Brand Style',
    description: 'Set your visual and tone preferences',
    icon: Palette,
  },
  {
    id: 'content',
    title: 'Content Types',
    description: 'Choose what content to generate',
    icon: Sparkles,
  },
]

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Entertainment',
  'Food & Beverage', 'Fashion', 'Real Estate', 'Automotive', 'Travel', 'Sports',
  'Non-Profit', 'B2B Services', 'Consumer Goods', 'Other'
]

const audienceTypes = [
  'Young Adults (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Baby Boomers (57+)',
  'Professionals', 'Students', 'Parents', 'Entrepreneurs', 'Small Business Owners',
  'Enterprise Decision Makers', 'Consumers', 'Other'
]

const toneStyles = [
  'Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Sophisticated',
  'Energetic', 'Calm', 'Humorous', 'Inspirational', 'Educational', 'Conversational'
]

const contentTypes = [
  { id: 'social-posts', label: 'Social Media Posts', description: 'Instagram, Facebook, Twitter posts', icon: MessageSquare },
  { id: 'blog-articles', label: 'Blog Articles', description: 'SEO-optimized blog content', icon: FileText },
  { id: 'product-descriptions', label: 'Product Descriptions', description: 'E-commerce product copy', icon: Globe },
  { id: 'ad-copy', label: 'Ad Copy', description: 'Google Ads, Facebook Ads copy', icon: Target },
  { id: 'email-campaigns', label: 'Email Campaigns', description: 'Newsletter and marketing emails', icon: MessageSquare },
  { id: 'visual-content', label: 'Visual Content', description: 'Images, graphics, and visual assets', icon: Image },
  { id: 'video-scripts', label: 'Video Scripts', description: 'Scripts for marketing videos', icon: Video },
  { id: 'audio-content', label: 'Audio Content', description: 'Podcast scripts, voiceovers', icon: Music },
]

interface CreateProjectFormProps {
  userId: string
}

export function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      productName: '',
      productDescription: '',
      industry: '',
      targetAudience: '',
      toneStyle: '',
      primaryColor: '#000000',
      secondaryColor: '',
      logoUrl: '',
      contentTypes: [],
    },
  })

  const onSubmit = async (data: CreateProjectData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const project = await response.json()
      toast.success('Project created successfully!')
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 ${
                isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <div className="text-center hidden sm:block">
                <div className="font-medium text-xs">{step.title}</div>
                <div className="text-xs text-muted-foreground max-w-20 mx-auto">
                  {step.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Summer Campaign 2024" {...field} />
                            </FormControl>
                            <FormDescription>
                              Give your project a memorable name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what this project is about..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide context about your project goals and objectives
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product/Brand Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Acme Corporation" {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of the product or brand you're marketing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product/Brand Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your product or brand..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              What does your product do? What makes it unique?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              This helps us tailor content for your market
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your target audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {audienceTypes.map((audience) => (
                                  <SelectItem key={audience} value={audience}>
                                    {audience}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Who are you trying to reach with your content?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="toneStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone & Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your brand tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {toneStyles.map((tone) => (
                                  <SelectItem key={tone} value={tone}>
                                    {tone}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How should your brand sound in communications?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Brand Color</FormLabel>
                              <FormControl>
                                <ColorPicker
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormDescription>
                                Your main brand color
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="secondaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secondary Color (Optional)</FormLabel>
                              <FormControl>
                                <ColorPicker
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormDescription>
                                Supporting brand color
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo URL (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/logo.png"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Link to your brand logo for visual content generation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="contentTypes"
                        render={() => (
                          <FormItem>
                            <FormLabel>Content Types to Generate</FormLabel>
                            <FormDescription className="mb-4">
                              Select the types of content you want to create for this project
                            </FormDescription>
                            <div className="grid md:grid-cols-2 gap-4">
                              {contentTypes.map((item) => {
                                const Icon = item.icon
                                return (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="contentTypes"
                                    render={({ field }) => (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              const updatedValues = checked
                                                ? [...(field.value || []), item.id]
                                                : (field.value || []).filter((value) => value !== item.id)
                                              field.onChange(updatedValues)
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            <FormLabel className="font-medium">
                                              {item.label}
                                            </FormLabel>
                                          </div>
                                          <FormDescription>
                                            {item.description}
                                          </FormDescription>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                )
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Creating...
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
