import { z } from 'zod'

// Content type definitions
export const ContentTypes = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE', 
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO'
} as const

export type ContentType = typeof ContentTypes[keyof typeof ContentTypes]

// Professional prompt templates optimized for marketing excellence
export class PromptEngine {
  
  /**
   * Generate sophisticated text content prompts
   */
  static generateTextPrompt({
    contentType,
    brandName,
    productDescription,
    targetAudience,
    toneStyle,
    industry,
    contentGoal,
    keyMessages,
    callToAction,
    brandValues,
    competitorAnalysis,
    seasonality,
    platform,
    contentLength,
    additionalContext
  }: {
    contentType: string
    brandName: string
    productDescription: string
    targetAudience: string
    toneStyle: string
    industry: string
    contentGoal: string
    keyMessages?: string[]
    callToAction?: string
    brandValues?: string[]
    competitorAnalysis?: string
    seasonality?: string
    platform?: string
    contentLength?: 'short' | 'medium' | 'long'
    additionalContext?: string
  }): string {
    
    const basePrompt = `You are a world-class marketing strategist and copywriter with 20+ years of experience creating high-converting content for Fortune 500 companies.

BRAND CONTEXT:
- Brand: ${brandName}
- Industry: ${industry}
- Product/Service: ${productDescription}
- Target Audience: ${targetAudience}
- Brand Tone: ${toneStyle}
- Content Goal: ${contentGoal}
${brandValues ? `- Brand Values: ${brandValues.join(', ')}` : ''}
${platform ? `- Platform: ${platform}` : ''}
${seasonality ? `- Seasonal Context: ${seasonality}` : ''}

CONTENT REQUIREMENTS:
- Type: ${contentType}
- Length: ${contentLength || 'medium'}
${keyMessages ? `- Key Messages to Include: ${keyMessages.join(', ')}` : ''}
${callToAction ? `- Call to Action: ${callToAction}` : ''}
${competitorAnalysis ? `- Competitive Landscape: ${competitorAnalysis}` : ''}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

OPTIMIZATION CRITERIA:
1. Psychological triggers: Use proven persuasion principles (social proof, scarcity, authority, reciprocity)
2. Emotional resonance: Connect with target audience's pain points, desires, and aspirations
3. Clarity and focus: Every word should serve the conversion goal
4. Platform optimization: Tailor format and style for the specific platform
5. SEO considerations: Include relevant keywords naturally
6. Brand consistency: Maintain voice, tone, and messaging alignment
7. Action-oriented: Drive specific behavioral outcomes

CONTENT SPECIFICATIONS:`

    // Content-specific prompts
    const contentSpecificPrompts = {
      'Blog Article': `
Create a comprehensive blog article that:
- Opens with a compelling hook that addresses a specific problem
- Provides actionable insights and value
- Includes data-driven points and industry expertise
- Uses subheadings for scanability
- Incorporates relevant keywords naturally
- Ends with a strong call-to-action
- Word count: ${contentLength === 'short' ? '800-1200' : contentLength === 'long' ? '2000-3000' : '1200-2000'} words`,

      'Social Media Post': `
Create a high-engagement social media post that:
- Starts with a pattern interrupt or bold statement
- Uses platform-specific formatting (hashtags, mentions, emojis where appropriate)
- Includes a clear value proposition
- Encourages engagement (likes, shares, comments)
- Has a compelling visual description if applicable
- Optimal character count for the platform`,

      'Email Campaign': `
Create a conversion-optimized email that:
- Subject line with 30-50 characters that maximizes open rates
- Personalized opening that builds connection
- Clear value proposition in the first paragraph
- Social proof and credibility indicators
- Multiple compelling CTAs throughout
- Mobile-optimized formatting
- P.S. line that reinforces the main offer`,

      'Ad Copy': `
Create high-converting ad copy that:
- Headline that stops the scroll and captures attention
- Focuses on benefits over features
- Creates urgency or scarcity when appropriate
- Addresses objections preemptively
- Multiple variations for A/B testing
- Complies with platform advertising policies
- Clear, prominent call-to-action`,

      'Product Description': `
Create a compelling product description that:
- Leading with the primary benefit
- Addresses target customer pain points
- Uses sensory language and emotional triggers
- Includes technical specifications naturally
- Anticipates and handles objections
- Builds desire and urgency
- Ends with confidence-boosting guarantee or offer`,

      'Landing Page Copy': `
Create high-converting landing page copy with:
- Attention-grabbing headline and subheadline
- Clear value proposition above the fold
- Benefit-focused bullet points
- Social proof and testimonials
- Risk reversal and guarantees
- Multiple strategic CTAs
- Objection handling throughout
- Urgency and scarcity elements`,

      'Video Script': `
Create an engaging video script that:
- Hook within the first 3 seconds
- Clear narrative arc with problem/solution
- Conversational, natural tone for voiceover
- Visual cue descriptions for production
- Emotional peaks and valleys for engagement
- Strong call-to-action at the end
- Duration: ${contentLength === 'short' ? '30-60 seconds' : contentLength === 'long' ? '3-5 minutes' : '90-180 seconds'}`,

      'Press Release': `
Create a newsworthy press release that:
- Compelling headline with news angle
- Strong lead paragraph with who, what, when, where, why
- Quotable executives and industry experts
- Industry context and significance
- Company boilerplate and contact information
- SEO-optimized for media pickup`,

      'Case Study': `
Create a detailed case study that:
- Compelling client success story
- Clear problem/solution framework
- Quantifiable results and metrics
- Process and methodology details
- Client testimonials and quotes
- Actionable insights for readers
- Strong conversion-focused conclusion`
    }

    const specificPrompt = contentSpecificPrompts[contentType as keyof typeof contentSpecificPrompts] || `
Create compelling ${contentType.toLowerCase()} content that drives engagement and conversions.`

    return `${basePrompt}${specificPrompt}

OUTPUT REQUIREMENTS:
- Provide 2-3 variations for testing
- Include performance optimization notes
- Suggest complementary content ideas
- Provide A/B testing recommendations

Generate world-class content that exceeds industry benchmarks and drives measurable business results.`
  }

  /**
   * Generate sophisticated image prompts for DALL-E 3
   */
  static generateImagePrompt({
    contentType,
    brandName,
    productDescription,
    primaryColor,
    secondaryColor,
    industry,
    style,
    mood,
    composition,
    targetAudience,
    platform,
    brandPersonality,
    competitorStyle,
    culturalContext,
    accessibilityNeeds
  }: {
    contentType: string
    brandName: string
    productDescription: string
    primaryColor: string
    secondaryColor?: string
    industry: string
    style: string
    mood: string
    composition: string
    targetAudience: string
    platform?: string
    brandPersonality?: string
    competitorStyle?: string
    culturalContext?: string
    accessibilityNeeds?: boolean
  }): string {

    const colorPalette = secondaryColor 
      ? `${primaryColor} and ${secondaryColor}` 
      : `${primaryColor} with complementary colors`

    return `Create a professional, high-impact marketing visual for ${brandName} with these specifications:

VISUAL CONCEPT:
- Content Type: ${contentType}
- Product/Service: ${productDescription}
- Industry Context: ${industry}
- Target Audience: ${targetAudience}
- Brand Personality: ${brandPersonality || 'professional and trustworthy'}

DESIGN SPECIFICATIONS:
- Style: ${style} (photorealistic, minimalist, abstract, illustration, etc.)
- Mood: ${mood} (energetic, calm, luxurious, friendly, authoritative, etc.)
- Composition: ${composition} (centered, rule of thirds, dynamic, symmetrical, etc.)
- Color Palette: ${colorPalette}
- Platform Optimization: ${platform || 'multi-platform'}

TECHNICAL REQUIREMENTS:
- Ultra-high quality, professional grade
- Sharp focus and perfect lighting
- Brand-appropriate typography if text is included
- Scalable design that works at multiple sizes
- ${accessibilityNeeds ? 'High contrast for accessibility compliance' : 'Visually striking contrast'}

MARKETING PSYCHOLOGY:
- Visual hierarchy that guides the eye to key elements
- Emotional triggers that resonate with ${targetAudience}
- Industry-appropriate sophistication level
- Conversion-optimized visual flow
${competitorStyle ? `- Differentiated from typical ${competitorStyle} style` : ''}
${culturalContext ? `- Culturally appropriate for ${culturalContext}` : ''}

OUTPUT STYLE:
Create a visually stunning, professionally crafted image that immediately communicates quality, trustworthiness, and value. The image should stop the scroll, capture attention, and drive engagement while perfectly representing the ${brandName} brand identity.

Avoid: Generic stock photo appearance, cluttered compositions, poor contrast, amateur lighting, copyright-infringing elements.`
  }

  /**
   * Generate video concept and script prompts
   */
  static generateVideoPrompt({
    videoType,
    brandName,
    productDescription,
    targetAudience,
    duration,
    platform,
    goal,
    toneStyle,
    callToAction,
    keyMessages,
    brandPersonality
  }: {
    videoType: string
    brandName: string
    productDescription: string
    targetAudience: string
    duration: string
    platform: string
    goal: string
    toneStyle: string
    callToAction?: string
    keyMessages?: string[]
    brandPersonality?: string
  }): string {

    return `Create a high-converting video script and production guide for ${brandName}:

VIDEO SPECIFICATIONS:
- Type: ${videoType}
- Duration: ${duration}
- Platform: ${platform}
- Goal: ${goal}
- Target Audience: ${targetAudience}
- Tone: ${toneStyle}
- Brand Personality: ${brandPersonality || 'professional and engaging'}

CONTENT FRAMEWORK:
- Product/Service: ${productDescription}
${keyMessages ? `- Key Messages: ${keyMessages.join(', ')}` : ''}
${callToAction ? `- Call to Action: ${callToAction}` : ''}

SCRIPT REQUIREMENTS:
1. Hook (0-3 seconds): Immediate attention grabber
2. Problem/Pain Point (3-10 seconds): Relatable audience challenge
3. Solution Introduction (10-20 seconds): Product/service presentation
4. Benefits/Social Proof (20-40 seconds): Value demonstration
5. Call to Action (40+ seconds): Clear next steps

PRODUCTION NOTES:
- Shot list with specific camera angles
- Lighting requirements for brand mood
- Music/audio recommendations
- Text overlay suggestions
- Color grading notes to match brand palette
- Platform-specific formatting requirements

ENGAGEMENT OPTIMIZATION:
- Visual pattern interrupts every 3-5 seconds
- Emotional peaks and valleys
- Clear visual hierarchy
- Mobile-first composition
- Accessibility considerations (captions, high contrast)

OUTPUT DELIVERABLES:
1. Complete shot-by-shot script
2. Production timeline and requirements
3. Post-production guidelines
4. Platform optimization notes
5. Performance metrics to track

Create a video concept that maximizes engagement, drives conversions, and builds lasting brand affinity.`
  }

  /**
   * Generate audio content prompts (podcasts, voiceovers, etc.)
   */
  static generateAudioPrompt({
    audioType,
    brandName,
    content,
    duration,
    targetAudience,
    toneStyle,
    purpose,
    voiceCharacteristics,
    backgroundMusic,
    callToAction
  }: {
    audioType: string
    brandName: string
    content: string
    duration: string
    targetAudience: string
    toneStyle: string
    purpose: string
    voiceCharacteristics?: string
    backgroundMusic?: string
    callToAction?: string
  }): string {

    return `Create professional audio content for ${brandName}:

AUDIO SPECIFICATIONS:
- Type: ${audioType}
- Duration: ${duration}
- Target Audience: ${targetAudience}
- Tone: ${toneStyle}
- Purpose: ${purpose}

VOICE REQUIREMENTS:
- Characteristics: ${voiceCharacteristics || 'clear, professional, engaging'}
- Pacing: Appropriate for audience and platform
- Emphasis: Strategic highlighting of key points
- Emotion: Matches brand personality and content goal

SCRIPT STRUCTURE:
- Opening hook that captures attention
- Clear, logical content flow
- Strategic pauses for emphasis
- Natural, conversational delivery
- Strong closing with clear next steps

CONTENT: ${content}
${callToAction ? `CALL TO ACTION: ${callToAction}` : ''}

PRODUCTION NOTES:
- Audio quality: Professional studio standards
- Background music: ${backgroundMusic || 'Subtle, brand-appropriate'} 
- Sound effects: Minimal, purposeful
- Post-production: Professional editing and mastering

ENGAGEMENT ELEMENTS:
- Voice modulation to maintain interest
- Strategic repetition of key points
- Clear pronunciation guide for brand/product names
- Accessibility considerations

Generate a script that creates emotional connection, builds trust, and drives action through expertly crafted audio storytelling.`
  }
}

// Validation schemas for prompt parameters
export const TextPromptSchema = z.object({
  contentType: z.string(),
  brandName: z.string(),
  productDescription: z.string(),
  targetAudience: z.string(),
  toneStyle: z.string(),
  industry: z.string(),
  contentGoal: z.string(),
  keyMessages: z.array(z.string()).optional(),
  callToAction: z.string().optional(),
  brandValues: z.array(z.string()).optional(),
  competitorAnalysis: z.string().optional(),
  seasonality: z.string().optional(),
  platform: z.string().optional(),
  contentLength: z.enum(['short', 'medium', 'long']).optional(),
  additionalContext: z.string().optional()
})

export const ImagePromptSchema = z.object({
  contentType: z.string(),
  brandName: z.string(),
  productDescription: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string().optional(),
  industry: z.string(),
  style: z.string(),
  mood: z.string(),
  composition: z.string(),
  targetAudience: z.string(),
  platform: z.string().optional(),
  brandPersonality: z.string().optional(),
  competitorStyle: z.string().optional(),
  culturalContext: z.string().optional(),
  accessibilityNeeds: z.boolean().optional()
})

export const VideoPromptSchema = z.object({
  videoType: z.string(),
  brandName: z.string(),
  productDescription: z.string(),
  targetAudience: z.string(),
  duration: z.string(),
  platform: z.string(),
  goal: z.string(),
  toneStyle: z.string(),
  callToAction: z.string().optional(),
  keyMessages: z.array(z.string()).optional(),
  brandPersonality: z.string().optional()
})

export const AudioPromptSchema = z.object({
  audioType: z.string(),
  brandName: z.string(),
  content: z.string(),
  duration: z.string(),
  targetAudience: z.string(),
  toneStyle: z.string(),
  purpose: z.string(),
  voiceCharacteristics: z.string().optional(),
  backgroundMusic: z.string().optional(),
  callToAction: z.string().optional()
})
