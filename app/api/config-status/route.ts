import { NextResponse } from 'next/server'
import { ConfigValidator } from '@/lib/config'

export async function GET() {
  try {
    const openaiConfigured = ConfigValidator.isOpenAIConfigured()
    const s3Configured = ConfigValidator.isS3Configured()
    const message = ConfigValidator.getConfigStatus()
    
    return NextResponse.json({
      openai: openaiConfigured,
      s3: s3Configured,
      message,
      success: true
    })
  } catch (error) {
    console.error('Config status check error:', error)
    return NextResponse.json({
      openai: false,
      s3: false,
      message: 'Configuration check failed',
      success: false
    }, { status: 500 })
  }
}
