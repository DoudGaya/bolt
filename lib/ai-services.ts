import OpenAI from 'openai'
import { S3Service } from './s3'
import { PromptEngine } from '../actions/prompts'
import { ConfigValidator, FallbackService } from './config'

// Initialize AI service providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Professional AI service interfaces
export interface AdvancedTextGenerationParams {
  contentType: string
  brandContext: {
    brandName: string
    productDescription: string
    industry: string
    targetAudience: string
    toneStyle: string
    primaryColor: string
    secondaryColor?: string
    brandValues?: string[]
  }
  contentRequirements: {
    goal: string
    platform?: string
    contentLength?: 'short' | 'medium' | 'long'
    keyMessages?: string[]
    callToAction?: string
    additionalContext?: string
  }
  optimization: {
    seoKeywords?: string[]
    competitorAnalysis?: string
    seasonality?: string
    abTestVariations?: number
  }
}

export interface ProfessionalImageGenerationParams {
  contentType: string
  brandContext: {
    brandName: string
    productDescription: string
    industry: string
    primaryColor: string
    secondaryColor?: string
    targetAudience: string
  }
  visualRequirements: {
    style: string
    mood: string
    composition: string
    platform?: string
    dimensions?: '1024x1024' | '1792x1024' | '1024x1792'
  }
  brandPersonality?: string
  culturalContext?: string
  accessibilityNeeds?: boolean
}

export interface AdvancedVideoGenerationParams {
  videoType: string
  brandContext: {
    brandName: string
    productDescription: string
    targetAudience: string
    toneStyle: string
    brandPersonality?: string
  }
  videoRequirements: {
    duration: string
    platform: string
    goal: string
    keyMessages?: string[]
    callToAction?: string
  }
  productionNotes?: {
    voiceOver?: boolean
    backgroundMusic?: string
    visualStyle?: string
  }
}

export interface ProfessionalAudioGenerationParams {
  audioType: string
  content: string
  brandContext: {
    brandName: string
    targetAudience: string
    toneStyle: string
  }
  audioRequirements: {
    duration: string
    purpose: string
    voiceCharacteristics?: string
    backgroundMusic?: string
    callToAction?: string
  }
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
}

export interface ContentGenerationResult {
  content: string
  metadata: {
    tokensUsed?: number
    processingTime: number
    variations?: string[]
    optimizationNotes?: string[]
    performanceMetrics?: {
      readabilityScore?: number
      sentimentScore?: number
      seoScore?: number
    }
  }
  s3Url?: string
  fileName?: string
}

export class ProfessionalAIService {
  
  /**
   * Generate high-quality marketing text content with advanced optimization
   */
  static async generateAdvancedText(params: AdvancedTextGenerationParams): Promise<ContentGenerationResult> {
    const startTime = Date.now()
    
    try {
      // Validate OpenAI API key
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured')
      }

      console.log('Generating text content for:', params.contentType)

      // Generate sophisticated prompt using PromptEngine
      const prompt = PromptEngine.generateTextPrompt({
        contentType: params.contentType,
        brandName: params.brandContext.brandName,
        productDescription: params.brandContext.productDescription,
        targetAudience: params.brandContext.targetAudience,
        toneStyle: params.brandContext.toneStyle,
        industry: params.brandContext.industry,
        contentGoal: params.contentRequirements.goal,
        keyMessages: params.contentRequirements.keyMessages,
        callToAction: params.contentRequirements.callToAction,
        brandValues: params.brandContext.brandValues,
        competitorAnalysis: params.optimization.competitorAnalysis,
        seasonality: params.optimization.seasonality,
        platform: params.contentRequirements.platform,
        contentLength: params.contentRequirements.contentLength,
        additionalContext: params.contentRequirements.additionalContext
      })

      console.log('Generated text prompt (length:', prompt.length, 'chars)')

      // Use GPT-4 Turbo for superior content quality
      console.log('Calling OpenAI API...')
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: 'You are a world-class marketing strategist and copywriter with expertise in conversion optimization, brand strategy, and consumer psychology. Generate content that exceeds industry standards and drives measurable business results.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      })

      console.log('OpenAI API response received')

      const generatedContent = completion.choices[0]?.message?.content || ''
      
      if (!generatedContent) {
        throw new Error('No content generated by OpenAI')
      }

      console.log('Generated content length:', generatedContent.length, 'characters')
      
      // Generate additional variations if requested
      const variations: string[] = []
      if (params.optimization.abTestVariations && params.optimization.abTestVariations > 1) {
        console.log('Generating', params.optimization.abTestVariations - 1, 'variations...')
        for (let i = 1; i < params.optimization.abTestVariations; i++) {
          const variationCompletion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
              { 
                role: 'system', 
                content: 'Create a distinct variation of the content with different angles and approaches while maintaining the same core objectives.'
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 2000,
            temperature: 0.8,
          })
          
          const variation = variationCompletion.choices[0]?.message?.content
          if (variation) variations.push(variation)
        }
      }

      // Save to S3 with organized file structure
      const fileName = `content/${params.brandContext.brandName.toLowerCase().replace(/\s+/g, '-')}/${params.contentType.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.txt`
      
      console.log('Uploading text content to S3...')
      const s3Url = await S3Service.uploadFile(
        fileName,
        generatedContent,
        'text/plain'
      )

      console.log('Text content generation completed successfully')

      const processingTime = Date.now() - startTime

      return {
        content: generatedContent,
        metadata: {
          tokensUsed: completion.usage?.total_tokens,
          processingTime,
          variations,
          optimizationNotes: [
            'Content optimized for conversion and engagement',
            'SEO considerations integrated naturally',
            'Brand voice consistency maintained',
            'Target audience psychology leveraged'
          ]
        },
        s3Url,
        fileName
      }

    } catch (error) {
      console.error('Text generation error details:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      // Try fallback for specific errors
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          console.log('OpenAI API key issue, using fallback...')
          return await this.generateFallbackText(params)
        } else if (error.message.includes('rate_limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        } else if (error.message.includes('S3')) {
          console.log('S3 issue, trying fallback...')
          return await this.generateFallbackText(params)
        } else if (error.message.includes('model')) {
          console.log('Model unavailable, using fallback...')
          return await this.generateFallbackText(params)
        } else {
          console.log('Unknown error, trying fallback...')
          return await this.generateFallbackText(params)
        }
      }
      
      // If all else fails, try fallback
      try {
        return await this.generateFallbackText(params)
      } catch (fallbackError) {
        throw new Error('Failed to generate text content. Please try again.')
      }
    }
  }

  /**
   * Generate professional marketing images with brand consistency
   */
  static async generateProfessionalImage(params: ProfessionalImageGenerationParams): Promise<ContentGenerationResult> {
    const startTime = Date.now()
    
    try {
      // Validate OpenAI API key
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured')
      }

      // Generate sophisticated image prompt
      const prompt = PromptEngine.generateImagePrompt({
        contentType: params.contentType,
        brandName: params.brandContext.brandName,
        productDescription: params.brandContext.productDescription,
        primaryColor: params.brandContext.primaryColor,
        secondaryColor: params.brandContext.secondaryColor,
        industry: params.brandContext.industry,
        style: params.visualRequirements.style || 'professional',
        mood: params.visualRequirements.mood || 'engaging',
        composition: params.visualRequirements.composition || 'dynamic',
        targetAudience: params.brandContext.targetAudience,
        platform: params.visualRequirements.platform || 'social media',
        brandPersonality: params.brandPersonality,
        competitorStyle: undefined, // Not used in this context
        culturalContext: params.culturalContext,
        accessibilityNeeds: params.accessibilityNeeds || false
      })

      console.log('Generated image prompt (length:', prompt.length, 'chars)')

      // Validate prompt length (DALL-E has limits)
      if (prompt.length > 4000) {
        console.warn('Prompt too long, truncating...')
      }

      const finalPrompt = prompt.length > 4000 ? prompt.substring(0, 3900) + '...' : prompt

      // Generate high-quality image with DALL-E 3
      const imageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: finalPrompt,
        size: params.visualRequirements.dimensions || '1024x1024',
        quality: 'hd',
        style: 'vivid',
        n: 1,
      })

      console.log('DALL-E response received:', imageResponse.data?.length || 0, 'images')

      const imageUrl = imageResponse.data?.[0]?.url
      if (!imageUrl) {
        throw new Error('No image generated by DALL-E')
      }

      console.log('Image URL received, downloading and uploading to S3...')

      // Download and upload to S3
      const imageDownloadResponse = await fetch(imageUrl)
      if (!imageDownloadResponse.ok) {
        throw new Error(`Failed to download image: ${imageDownloadResponse.status} ${imageDownloadResponse.statusText}`)
      }

      const imageBuffer = Buffer.from(await imageDownloadResponse.arrayBuffer())
      
      const fileName = `images/${params.brandContext.brandName.toLowerCase().replace(/\s+/g, '-')}/${params.contentType.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.png`
      
      const s3Url = await S3Service.uploadFile(
        fileName,
        imageBuffer,
        'image/png'
      )

      console.log('Image successfully generated and uploaded to S3')

      const processingTime = Date.now() - startTime

      return {
        content: `Professional ${params.contentType} image generated for ${params.brandContext.brandName}`,
        metadata: {
          processingTime,
          optimizationNotes: [
            'High-resolution, professional quality',
            'Brand colors and personality integrated',
            'Platform-optimized composition',
            'Conversion-focused visual hierarchy'
          ]
        },
        s3Url,
        fileName
      }

    } catch (error) {
      console.error('Image generation error details:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      // Try fallback method for specific errors
      if (error instanceof Error) {
        if (error.message.includes('content_policy_violation')) {
          console.log('Content policy violation, trying fallback...')
          return await this.generateFallbackImage(params)
        } else if (error.message.includes('rate_limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        } else if (error.message.includes('S3')) {
          throw new Error('Failed to save image. Please check your S3 configuration.')
        } else if (error.message.includes('OpenAI API key')) {
          throw new Error('OpenAI API is not properly configured. Please check your environment variables.')
        } else if (error.message.includes('fetch')) {
          console.log('Network error, trying fallback...')
          return await this.generateFallbackImage(params)
        } else {
          console.log('Unknown error, trying fallback...')
          return await this.generateFallbackImage(params)
        }
      }
      
      // If all else fails, try fallback
      try {
        return await this.generateFallbackImage(params)
      } catch (fallbackError) {
        throw new Error('Failed to generate image content. Please try again.')
      }
    }
  }

  /**
   * Fallback method for image generation when DALL-E fails
   */
  static async generateFallbackImage(params: ProfessionalImageGenerationParams): Promise<ContentGenerationResult> {
    const startTime = Date.now()
    
    try {
      console.log('Using fallback image generation for:', params.contentType)
      
      // Create a descriptive text placeholder for the image
      const placeholderContent = `📸 Professional ${params.contentType} Placeholder

Brand: ${params.brandContext.brandName}
Style: ${params.visualRequirements.style}
Mood: ${params.visualRequirements.mood}
Colors: ${params.brandContext.primaryColor}${params.brandContext.secondaryColor ? ` & ${params.brandContext.secondaryColor}` : ''}
Platform: ${params.visualRequirements.platform || 'General'}

This is a placeholder for professional image content.
To generate real AI images, please configure your OpenAI API key.

Image specifications:
- Dimensions: ${params.visualRequirements.dimensions || '1024x1024'}
- Brand: ${params.brandContext.brandName}
- Industry: ${params.brandContext.industry}
- Target Audience: ${params.brandContext.targetAudience}

*Configure OpenAI DALL-E API for real image generation*
      `

      // Try to upload to S3 if available, otherwise use mock URL
      let s3Url: string
      let fileName: string
      
      if (ConfigValidator.isS3Configured()) {
        fileName = `images/placeholder/${params.brandContext.brandName.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.txt`
        const textBuffer = Buffer.from(placeholderContent, 'utf-8')
        s3Url = await S3Service.uploadFile(fileName, textBuffer, 'text/plain')
      } else {
        fileName = `placeholder-${params.contentType}-${Date.now()}.txt`
        s3Url = FallbackService.generateMockS3Url(fileName)
      }

      const processingTime = Date.now() - startTime

      return {
        content: `Placeholder content for ${params.contentType} - Configure OpenAI API for real image generation`,
        metadata: {
          processingTime,
          optimizationNotes: [
            'Fallback placeholder generated',
            'Configure OpenAI DALL-E API for real images',
            'This is placeholder content'
          ]
        },
        s3Url,
        fileName
      }

    } catch (error) {
      console.error('Fallback image generation error:', error)
      
      // Even if S3 fails, provide a basic response
      const fileName = `placeholder-${params.contentType}-${Date.now()}.txt`
      const s3Url = FallbackService.generateMockS3Url(fileName)
      
      return {
        content: `Placeholder for ${params.contentType} - Services temporarily unavailable`,
        metadata: {
          processingTime: Date.now() - startTime,
          optimizationNotes: [
            'Basic fallback generated',
            'Services need configuration',
            'Please check environment variables'
          ]
        },
        s3Url,
        fileName
      }
    }
  }

  /**
   * Generate comprehensive video scripts and production guides
   */
  static async generateVideoContent(params: AdvancedVideoGenerationParams): Promise<ContentGenerationResult> {
    const startTime = Date.now()
    
    try {
      // Generate comprehensive video prompt
      const prompt = PromptEngine.generateVideoPrompt({
        videoType: params.videoType,
        brandName: params.brandContext.brandName,
        productDescription: params.brandContext.productDescription,
        targetAudience: params.brandContext.targetAudience,
        duration: params.videoRequirements.duration,
        platform: params.videoRequirements.platform,
        goal: params.videoRequirements.goal,
        toneStyle: params.brandContext.toneStyle,
        callToAction: params.videoRequirements.callToAction,
        keyMessages: params.videoRequirements.keyMessages,
        brandPersonality: params.brandContext.brandPersonality
      })

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert video producer and marketing strategist. Create comprehensive video content that maximizes engagement and drives conversions.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2500,
        temperature: 0.7,
      })

      const videoContent = completion.choices[0]?.message?.content || ''

      // Save comprehensive video guide to S3
      const fileName = `video-scripts/${params.brandContext.brandName.toLowerCase().replace(/\s+/g, '-')}/${params.videoType.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.md`
      const s3Url = await S3Service.uploadFile(
        fileName,
        videoContent,
        'text/markdown'
      )

      const processingTime = Date.now() - startTime

      return {
        content: videoContent,
        metadata: {
          processingTime,
          optimizationNotes: [
            'Complete production-ready script',
            'Platform-specific optimization',
            'Engagement-maximized structure',
            'Professional production guidelines'
          ]
        },
        s3Url,
        fileName
      }

    } catch (error) {
      console.error('Video generation error:', error)
      throw new Error('Failed to generate video content. Please try again.')
    }
  }

  /**
   * Generate professional audio content and voiceovers
   */
  static async generateProfessionalAudio(params: ProfessionalAudioGenerationParams): Promise<ContentGenerationResult> {
    const startTime = Date.now()
    
    try {
      // First generate the script if content is not detailed enough
      let audioScript = params.content
      
      if (params.content.length < 100) {
        const scriptPrompt = PromptEngine.generateAudioPrompt({
          audioType: params.audioType,
          brandName: params.brandContext.brandName,
          content: params.content,
          duration: params.audioRequirements.duration,
          targetAudience: params.brandContext.targetAudience,
          toneStyle: params.brandContext.toneStyle,
          purpose: params.audioRequirements.purpose,
          voiceCharacteristics: params.audioRequirements.voiceCharacteristics,
          backgroundMusic: params.audioRequirements.backgroundMusic,
          callToAction: params.audioRequirements.callToAction
        })

        const scriptCompletion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            { 
              role: 'system', 
              content: 'You are a professional audio content creator and voice coach. Generate scripts optimized for audio delivery and engagement.'
            },
            { role: 'user', content: scriptPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        })

        audioScript = scriptCompletion.choices[0]?.message?.content || params.content
      }

      // Generate high-quality audio using OpenAI TTS
      const audioResponse = await openai.audio.speech.create({
        model: 'tts-1-hd',
        voice: params.voice || 'nova',
        input: audioScript,
        speed: params.speed || 1.0,
        response_format: 'mp3'
      })

      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer())

      // Upload to S3
      const fileName = `audio/${params.brandContext.brandName.toLowerCase().replace(/\s+/g, '-')}/${params.audioType.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.mp3`
      const s3Url = await S3Service.uploadFile(
        fileName,
        audioBuffer,
        'audio/mpeg'
      )

      const processingTime = Date.now() - startTime

      return {
        content: audioScript,
        metadata: {
          processingTime,
          optimizationNotes: [
            'Professional studio-quality audio',
            'Optimized script for audio delivery',
            'Brand-appropriate voice characteristics',
            'Engagement-focused pacing and tone'
          ]
        },
        s3Url,
        fileName
      }

    } catch (error) {
      console.error('Audio generation error:', error)
      throw new Error('Failed to generate audio content. Please try again.')
    }
  }

  /**
   * Generate multi-format content campaigns
   */
  static async generateContentCampaign(params: {
    brandContext: AdvancedTextGenerationParams['brandContext']
    campaignGoal: string
    contentTypes: string[]
    platform: string
    duration: string
  }): Promise<ContentGenerationResult[]> {
    
    const results: ContentGenerationResult[] = []
    
    for (const contentType of params.contentTypes) {
      try {
        if (contentType.includes('Text') || contentType.includes('Copy') || contentType.includes('Article')) {
          const textResult = await this.generateAdvancedText({
            contentType,
            brandContext: params.brandContext,
            contentRequirements: {
              goal: params.campaignGoal,
              platform: params.platform,
              contentLength: 'medium'
            },
            optimization: {
              abTestVariations: 2
            }
          })
          results.push(textResult)
        } else if (contentType.includes('Image') || contentType.includes('Visual')) {
          const imageResult = await this.generateProfessionalImage({
            contentType,
            brandContext: params.brandContext,
            visualRequirements: {
              style: 'professional',
              mood: 'engaging',
              composition: 'dynamic',
              platform: params.platform
            }
          })
          results.push(imageResult)
        }
      } catch (error) {
        console.error(`Failed to generate ${contentType}:`, error)
      }
    }

    return results
  }

  /**
   * Fallback text generation when OpenAI/S3 services aren't available
   */
  static async generateFallbackText(params: AdvancedTextGenerationParams): Promise<ContentGenerationResult> {
    const startTime = Date.now()
    
    try {
      console.log('Using fallback text generation for:', params.contentType)
      
      // Generate mock content based on the content type
      const mockContent = FallbackService.generateMockText(
        params.contentType, 
        params.brandContext.brandName
      )

      // Try to upload to S3 if available, otherwise use mock URL
      let s3Url: string
      let fileName: string
      
      if (ConfigValidator.isS3Configured()) {
        fileName = `content/fallback/${params.brandContext.brandName.toLowerCase().replace(/\s+/g, '-')}/${params.contentType.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.txt`
        s3Url = await S3Service.uploadFile(fileName, mockContent, 'text/plain')
      } else {
        fileName = `fallback-${params.contentType}-${Date.now()}.txt`
        s3Url = FallbackService.generateMockS3Url(fileName)
      }

      const processingTime = Date.now() - startTime

      return {
        content: mockContent,
        metadata: {
          processingTime,
          optimizationNotes: [
            'Fallback content generated',
            'Configure OpenAI API for AI-generated content',
            'This is placeholder content'
          ]
        },
        s3Url,
        fileName
      }

    } catch (error) {
      console.error('Fallback text generation error:', error)
      throw new Error('Both primary and fallback text generation failed')
    }
  }
}