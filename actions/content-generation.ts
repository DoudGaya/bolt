'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfessionalAIService, type AdvancedTextGenerationParams, type ProfessionalImageGenerationParams, type AdvancedVideoGenerationParams, type ProfessionalAudioGenerationParams } from '@/lib/ai-services'

// Advanced content generation schema
const advancedContentGenerationSchema = z.object({
  projectId: z.string(),
  contentType: z.string(),
  contentSubtype: z.string().optional(),
  requirements: z.object({
    goal: z.string(),
    platform: z.string().optional(),
    contentLength: z.enum(['short', 'medium', 'long']).optional(),
    keyMessages: z.array(z.string()).optional(),
    callToAction: z.string().optional(),
    additionalContext: z.string().optional(),
  }),
  visualRequirements: z.object({
    style: z.string().optional(),
    mood: z.string().optional(),
    composition: z.string().optional(),
    dimensions: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional(),
  }).optional(),
  audioRequirements: z.object({
    duration: z.string().optional(),
    voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional(),
    speed: z.number().min(0.25).max(4.0).optional(),
    purpose: z.string().optional(),
  }).optional(),
  optimization: z.object({
    seoKeywords: z.array(z.string()).optional(),
    competitorAnalysis: z.string().optional(),
    seasonality: z.string().optional(),
    abTestVariations: z.number().min(1).max(5).optional(),
    accessibilityNeeds: z.boolean().optional(),
  }).optional(),
})

type AdvancedContentGenerationInput = z.infer<typeof advancedContentGenerationSchema>

export async function generateAdvancedContent(input: AdvancedContentGenerationInput) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    // Validate input
    const validatedInput = advancedContentGenerationSchema.parse(input)

    // Get project details with brand context
    const project = await prisma.project.findFirst({
      where: {
        id: validatedInput.projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    // Prepare brand context
    const brandContext = {
      brandName: project.name,
      productDescription: project.productDescription,
      industry: project.industry,
      targetAudience: project.targetAudience,
      toneStyle: project.toneStyle,
      primaryColor: project.primaryColor,
      secondaryColor: project.secondaryColor || undefined,
      brandValues: [], // Could be extended from project schema
    }

    let result
    const contentType = validatedInput.contentType.toLowerCase()

    // Route to appropriate AI service based on content type
    if (contentType.includes('text') || contentType.includes('copy') || contentType.includes('article') || contentType.includes('email') || contentType.includes('ad')) {
      const textParams: AdvancedTextGenerationParams = {
        contentType: validatedInput.contentSubtype || validatedInput.contentType,
        brandContext,
        contentRequirements: validatedInput.requirements,
        optimization: validatedInput.optimization || {},
      }
      result = await ProfessionalAIService.generateAdvancedText(textParams)
      
    } else if (contentType.includes('image') || contentType.includes('visual') || contentType.includes('graphic')) {
      const imageParams: ProfessionalImageGenerationParams = {
        contentType: validatedInput.contentSubtype || validatedInput.contentType,
        brandContext,
        visualRequirements: {
          style: validatedInput.visualRequirements?.style || 'professional',
          mood: validatedInput.visualRequirements?.mood || 'engaging',
          composition: validatedInput.visualRequirements?.composition || 'dynamic',
          platform: validatedInput.requirements.platform,
          dimensions: validatedInput.visualRequirements?.dimensions || '1024x1024',
        },
        accessibilityNeeds: validatedInput.optimization?.accessibilityNeeds,
      }
      
      console.log('Generating image with params:', JSON.stringify(imageParams, null, 2))
      result = await ProfessionalAIService.generateProfessionalImage(imageParams)
      
    } else if (contentType.includes('video')) {
      const videoParams: AdvancedVideoGenerationParams = {
        videoType: validatedInput.contentSubtype || validatedInput.contentType,
        brandContext: {
          brandName: brandContext.brandName,
          productDescription: brandContext.productDescription,
          targetAudience: brandContext.targetAudience,
          toneStyle: brandContext.toneStyle,
        },
        videoRequirements: {
          duration: validatedInput.audioRequirements?.duration || '60 seconds',
          platform: validatedInput.requirements.platform || 'social media',
          goal: validatedInput.requirements.goal,
          keyMessages: validatedInput.requirements.keyMessages,
          callToAction: validatedInput.requirements.callToAction,
        },
      }
      result = await ProfessionalAIService.generateVideoContent(videoParams)
      
    } else if (contentType.includes('audio') || contentType.includes('voice') || contentType.includes('podcast')) {
      const audioParams: ProfessionalAudioGenerationParams = {
        audioType: validatedInput.contentSubtype || validatedInput.contentType,
        content: validatedInput.requirements.additionalContext || validatedInput.requirements.goal,
        brandContext: {
          brandName: brandContext.brandName,
          targetAudience: brandContext.targetAudience,
          toneStyle: brandContext.toneStyle,
        },
        audioRequirements: {
          duration: validatedInput.audioRequirements?.duration || '30 seconds',
          purpose: validatedInput.audioRequirements?.purpose || validatedInput.requirements.goal,
          callToAction: validatedInput.requirements.callToAction,
        },
        voice: validatedInput.audioRequirements?.voice || 'nova',
        speed: validatedInput.audioRequirements?.speed || 1.0,
      }
      result = await ProfessionalAIService.generateProfessionalAudio(audioParams)
      
    } else {
      throw new Error(`Unsupported content type: ${validatedInput.contentType}`)
    }

    // Determine the correct ContentType enum value
    let contentTypeEnum: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' = 'TEXT'
    if (contentType.includes('image') || contentType.includes('visual') || contentType.includes('graphic')) {
      contentTypeEnum = 'IMAGE'
    } else if (contentType.includes('video')) {
      contentTypeEnum = 'VIDEO'
    } else if (contentType.includes('audio') || contentType.includes('voice') || contentType.includes('podcast')) {
      contentTypeEnum = 'AUDIO'
    }

    // Save to database with enhanced metadata
    const savedContent = await prisma.generatedContent.create({
      data: {
        projectId: validatedInput.projectId,
        type: contentTypeEnum,
        title: `${validatedInput.contentSubtype || validatedInput.contentType} - ${new Date().toLocaleDateString()}`,
        description: `Professional ${validatedInput.contentType} generated for ${project.name}`,
        content: result.content,
        fileUrl: result.s3Url,
        fileName: result.fileName,
        status: 'COMPLETED',
        parameters: {
          ...validatedInput,
          brandContext,
          processingTime: result.metadata.processingTime,
          tokensUsed: result.metadata.tokensUsed,
          optimizationNotes: result.metadata.optimizationNotes,
          variations: result.metadata.variations,
        },
      },
    })

    revalidatePath(`/dashboard/projects/${validatedInput.projectId}`)
    
    return {
      success: true,
      content: savedContent,
      s3Url: result.s3Url,
      metadata: result.metadata,
    }

  } catch (error) {
    console.error('Advanced content generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content',
    }
  }
}

// Batch content generation for campaigns
const campaignGenerationSchema = z.object({
  projectId: z.string(),
  campaignName: z.string(),
  campaignGoal: z.string(),
  contentTypes: z.array(z.string()),
  platform: z.string(),
  duration: z.string(),
  budget: z.number().optional(),
  targetMetrics: z.object({
    reach: z.number().optional(),
    engagement: z.number().optional(),
    conversions: z.number().optional(),
  }).optional(),
})

export async function generateContentCampaign(input: z.infer<typeof campaignGenerationSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validatedInput = campaignGenerationSchema.parse(input)

    // Get project details
    const project = await prisma.project.findFirst({
      where: {
        id: validatedInput.projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    const brandContext = {
      brandName: project.name,
      productDescription: project.productDescription,
      industry: project.industry,
      targetAudience: project.targetAudience,
      toneStyle: project.toneStyle,
      primaryColor: project.primaryColor,
      secondaryColor: project.secondaryColor || undefined,
    }

    // Generate comprehensive campaign content
    const campaignResults = await ProfessionalAIService.generateContentCampaign({
      brandContext,
      campaignGoal: validatedInput.campaignGoal,
      contentTypes: validatedInput.contentTypes,
      platform: validatedInput.platform,
      duration: validatedInput.duration,
    })

    // Save all campaign content to database
    const savedContents = []
    for (let i = 0; i < campaignResults.length; i++) {
      const result = campaignResults[i]
      const contentType = validatedInput.contentTypes[i] || 'TEXT'
      
      // Determine ContentType enum
      let contentTypeEnum: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' = 'TEXT'
      if (contentType.toLowerCase().includes('image') || contentType.toLowerCase().includes('visual')) {
        contentTypeEnum = 'IMAGE'
      } else if (contentType.toLowerCase().includes('video')) {
        contentTypeEnum = 'VIDEO'
      } else if (contentType.toLowerCase().includes('audio')) {
        contentTypeEnum = 'AUDIO'
      }
      
      const savedContent = await prisma.generatedContent.create({
        data: {
          projectId: validatedInput.projectId,
          type: contentTypeEnum,
          title: `${validatedInput.campaignName} - Campaign Content`,
          description: `Part of ${validatedInput.campaignName} campaign`,
          content: result.content,
          fileUrl: result.s3Url,
          fileName: result.fileName,
          status: 'COMPLETED',
          parameters: {
            campaignName: validatedInput.campaignName,
            campaignGoal: validatedInput.campaignGoal,
            platform: validatedInput.platform,
            duration: validatedInput.duration,
            metadata: result.metadata,
          },
        },
      })
      savedContents.push(savedContent)
    }

    revalidatePath(`/dashboard/projects/${validatedInput.projectId}`)
    
    return {
      success: true,
      campaign: {
        name: validatedInput.campaignName,
        contentCount: savedContents.length,
        contents: savedContents,
      },
    }

  } catch (error) {
    console.error('Campaign generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate campaign',
    }
  }
}

// Content optimization and A/B testing
const contentOptimizationSchema = z.object({
  contentId: z.string(),
  optimizationType: z.enum(['seo', 'conversion', 'engagement', 'accessibility']),
  testVariations: z.number().min(2).max(5).optional(),
  targetMetrics: z.array(z.string()).optional(),
})

export async function optimizeContent(input: z.infer<typeof contentOptimizationSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validatedInput = contentOptimizationSchema.parse(input)

    // Get original content
    const originalContent = await prisma.generatedContent.findFirst({
      where: {
        id: validatedInput.contentId,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: true,
      },
    })

    if (!originalContent) {
      throw new Error('Content not found')
    }

    // Generate optimized variations
    const optimizedResults = []
    const variationCount = validatedInput.testVariations || 2

    for (let i = 0; i < variationCount; i++) {
      // Create optimization-specific prompt
      const optimizationPrompt = `
Optimize the following content for ${validatedInput.optimizationType}:

Original Content: ${originalContent.content}

Optimization Goals:
- Type: ${validatedInput.optimizationType}
- Target Metrics: ${validatedInput.targetMetrics?.join(', ') || 'General improvement'}
- Brand: ${originalContent.project.name}
- Audience: ${originalContent.project.targetAudience}

Create a variation that significantly improves ${validatedInput.optimizationType} while maintaining brand voice and core messaging.
Variation ${i + 1} should take a ${i === 0 ? 'conservative' : i === 1 ? 'moderate' : 'aggressive'} approach to optimization.`

      // For now, using text generation - could be extended for other content types
      const optimizedResult = await ProfessionalAIService.generateAdvancedText({
        contentType: originalContent.type,
        brandContext: {
          brandName: originalContent.project.name,
          productDescription: originalContent.project.productDescription,
          industry: originalContent.project.industry,
          targetAudience: originalContent.project.targetAudience,
          toneStyle: originalContent.project.toneStyle,
          primaryColor: originalContent.project.primaryColor,
          secondaryColor: originalContent.project.secondaryColor || undefined,
        },
        contentRequirements: {
          goal: `Optimize for ${validatedInput.optimizationType}`,
          additionalContext: optimizationPrompt,
        },
        optimization: {
          abTestVariations: 1,
        },
      })

      const savedOptimization = await prisma.generatedContent.create({
        data: {
          projectId: originalContent.projectId,
          type: originalContent.type,
          title: `${originalContent.title} - ${validatedInput.optimizationType.toUpperCase()} Optimized v${i + 1}`,
          description: `${validatedInput.optimizationType} optimized variation of original content`,
          content: optimizedResult.content,
          fileUrl: optimizedResult.s3Url,
          fileName: optimizedResult.fileName,
          status: 'COMPLETED',
          parameters: {
            originalContentId: validatedInput.contentId,
            optimizationType: validatedInput.optimizationType,
            variationNumber: i + 1,
            targetMetrics: validatedInput.targetMetrics,
            metadata: optimizedResult.metadata,
          },
        },
      })

      optimizedResults.push(savedOptimization)
    }

    revalidatePath(`/dashboard/projects/${originalContent.projectId}`)
    
    return {
      success: true,
      originalContent,
      optimizedVariations: optimizedResults,
    }

  } catch (error) {
    console.error('Content optimization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to optimize content',
    }
  }
}

// Content performance analytics
export async function analyzeContentPerformance(contentId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const content = await prisma.generatedContent.findFirst({
      where: {
        id: contentId,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: true,
      },
    })

    if (!content) {
      throw new Error('Content not found')
    }

    // In a real application, this would integrate with analytics services
    // For now, we'll simulate performance metrics
    const mockAnalytics = {
      views: Math.floor(Math.random() * 10000) + 1000,
      engagementRate: Number((Math.random() * 0.1 + 0.02).toFixed(3)),
      clickThroughRate: Number((Math.random() * 0.05 + 0.01).toFixed(3)),
      conversionRate: Number((Math.random() * 0.03 + 0.005).toFixed(3)),
      socialShares: Math.floor(Math.random() * 500) + 50,
      commentsCount: Math.floor(Math.random() * 100) + 10,
      sentiment: {
        positive: Number((Math.random() * 0.4 + 0.5).toFixed(2)),
        neutral: Number((Math.random() * 0.3 + 0.2).toFixed(2)),
        negative: Number((Math.random() * 0.2 + 0.05).toFixed(2)),
      },
      demographics: {
        ageGroups: {
          '18-24': Number((Math.random() * 0.3 + 0.1).toFixed(2)),
          '25-34': Number((Math.random() * 0.4 + 0.2).toFixed(2)),
          '35-44': Number((Math.random() * 0.3 + 0.15).toFixed(2)),
          '45+': Number((Math.random() * 0.2 + 0.05).toFixed(2)),
        },
        genderSplit: {
          male: Number((Math.random() * 0.3 + 0.35).toFixed(2)),
          female: Number((Math.random() * 0.3 + 0.35).toFixed(2)),
          other: Number((Math.random() * 0.1 + 0.02).toFixed(2)),
        },
      },
      platformPerformance: {
        facebook: Number((Math.random() * 5 + 3).toFixed(1)),
        instagram: Number((Math.random() * 5 + 3).toFixed(1)),
        twitter: Number((Math.random() * 5 + 3).toFixed(1)),
        linkedin: Number((Math.random() * 5 + 3).toFixed(1)),
      },
      competitorComparison: {
        industryAverage: {
          engagementRate: 0.045,
          clickThroughRate: 0.025,
          conversionRate: 0.018,
        },
        performanceRating: 'Above Average', // Could be 'Below Average', 'Average', 'Above Average', 'Excellent'
      },
    }

    return {
      success: true,
      analytics: mockAnalytics,
      content: {
        id: content.id,
        title: content.title,
        type: content.type,
        createdAt: content.createdAt,
      },
    }

  } catch (error) {
    console.error('Performance analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze performance',
    }
  }
}

// Campaign content generation (used by CampaignBuilder)
const campaignContentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  projectId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  platforms: z.array(z.string()),
  contentTypes: z.array(z.string()),
  goals: z.array(z.string()),
  targetAudience: z.string(),
  budget: z.string().optional(),
  contentVolume: z.object({
    daily: z.number(),
    weekly: z.number(),
    total: z.number(),
  }),
  optimization: z.object({
    abTesting: z.boolean(),
    seoFocus: z.boolean(),
    accessibility: z.boolean(),
    brandConsistency: z.boolean(),
  }),
})

export async function generateCampaignContent(input: z.infer<typeof campaignContentSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validatedInput = campaignContentSchema.parse(input)

    // Get project details
    const project = await prisma.project.findFirst({
      where: {
        id: validatedInput.projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    const brandContext = {
      brandName: project.name,
      productDescription: project.productDescription,
      industry: project.industry,
      targetAudience: validatedInput.targetAudience,
      toneStyle: project.toneStyle,
      primaryColor: project.primaryColor,
      secondaryColor: project.secondaryColor || undefined,
    }

    // Calculate content distribution
    const totalDays = Math.ceil((validatedInput.endDate.getTime() - validatedInput.startDate.getTime()) / (1000 * 60 * 60 * 24))
    const contentPerPlatform = Math.ceil(validatedInput.contentVolume.total / validatedInput.platforms.length)
    const contentPerType = Math.ceil(contentPerPlatform / validatedInput.contentTypes.length)

    const generatedContents = []

    // Generate content for each platform and type combination
    for (const platform of validatedInput.platforms) {
      for (const contentType of validatedInput.contentTypes) {
        for (let i = 0; i < contentPerType; i++) {
          const contentRequirements = {
            goal: validatedInput.goals.join(', '),
            platform: platform,
            contentLength: 'medium' as const,
            keyMessages: [`Campaign: ${validatedInput.name}`, `Platform: ${platform}`],
            callToAction: `Learn more about ${project.productName}`,
            additionalContext: `Part of ${validatedInput.name} campaign. ${validatedInput.description || ''}`,
          }

          let result
          let contentTypeEnum: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' = 'TEXT'

          if (contentType === 'TEXT') {
            contentTypeEnum = 'TEXT'
            const textParams: AdvancedTextGenerationParams = {
              contentType: `${platform} ${contentType}`,
              brandContext,
              contentRequirements,
              optimization: {
                seoKeywords: validatedInput.optimization.seoFocus ? [project.productName, project.industry] : [],
                abTestVariations: validatedInput.optimization.abTesting ? 2 : 1,
              },
            }
            result = await ProfessionalAIService.generateAdvancedText(textParams)
            
          } else if (contentType === 'IMAGE') {
            contentTypeEnum = 'IMAGE'
            const imageParams: ProfessionalImageGenerationParams = {
              contentType: `${platform} Visual Content`,
              brandContext,
              visualRequirements: {
                style: 'professional',
                mood: 'engaging',
                composition: 'dynamic',
                platform: platform,
                dimensions: '1024x1024',
              },
              accessibilityNeeds: validatedInput.optimization.accessibility,
            }
            result = await ProfessionalAIService.generateProfessionalImage(imageParams)
            
          } else if (contentType === 'VIDEO') {
            contentTypeEnum = 'VIDEO'
            const videoParams: AdvancedVideoGenerationParams = {
              videoType: `${platform} Video Content`,
              brandContext: {
                brandName: brandContext.brandName,
                productDescription: brandContext.productDescription,
                targetAudience: brandContext.targetAudience,
                toneStyle: brandContext.toneStyle,
              },
              videoRequirements: {
                duration: platform === 'tiktok' || platform === 'instagram' ? '30 seconds' : '60 seconds',
                platform: platform,
                goal: validatedInput.goals.join(', '),
                keyMessages: contentRequirements.keyMessages,
                callToAction: contentRequirements.callToAction,
              },
            }
            result = await ProfessionalAIService.generateVideoContent(videoParams)
            
          } else if (contentType === 'AUDIO') {
            contentTypeEnum = 'AUDIO'
            const audioParams: ProfessionalAudioGenerationParams = {
              audioType: `${platform} Audio Content`,
              content: `${validatedInput.description} Targeting: ${validatedInput.targetAudience}`,
              brandContext: {
                brandName: brandContext.brandName,
                targetAudience: brandContext.targetAudience,
                toneStyle: brandContext.toneStyle,
              },
              audioRequirements: {
                duration: '30 seconds',
                purpose: validatedInput.goals.join(', '),
                callToAction: contentRequirements.callToAction,
              },
              voice: 'nova',
              speed: 1.0,
            }
            result = await ProfessionalAIService.generateProfessionalAudio(audioParams)
          }

          if (result) {
            const savedContent = await prisma.generatedContent.create({
              data: {
                projectId: validatedInput.projectId,
                type: contentTypeEnum,
                title: `${validatedInput.name} - ${platform} ${contentType} #${i + 1}`,
                description: `Campaign content for ${validatedInput.name} on ${platform}`,
                content: result.content,
                fileUrl: result.s3Url,
                fileName: result.fileName,
                status: 'COMPLETED',
                parameters: {
                  ...validatedInput,
                  campaignName: validatedInput.name,
                  platform: platform,
                  contentType: contentType,
                  generationIndex: i + 1,
                  totalInCampaign: validatedInput.contentVolume.total,
                  brandContext,
                  contentRequirements,
                  generationMetadata: result.metadata,
                },
              },
            })
            
            generatedContents.push(savedContent)
          }

          // Don't exceed total content limit
          if (generatedContents.length >= validatedInput.contentVolume.total) {
            break
          }
        }
        
        if (generatedContents.length >= validatedInput.contentVolume.total) {
          break
        }
      }
      
      if (generatedContents.length >= validatedInput.contentVolume.total) {
        break
      }
    }

    revalidatePath(`/dashboard/projects/${validatedInput.projectId}`)
    revalidatePath('/dashboard/content')
    revalidatePath('/dashboard/campaigns')
    
    return {
      success: true,
      contentCount: generatedContents.length,
      contents: generatedContents,
      campaign: {
        name: validatedInput.name,
        platforms: validatedInput.platforms,
        contentTypes: validatedInput.contentTypes,
        totalContent: generatedContents.length,
      },
    }

  } catch (error) {
    console.error('Campaign content generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate campaign content',
    }
  }
}

// Export types for use in components
export type { AdvancedContentGenerationInput }
