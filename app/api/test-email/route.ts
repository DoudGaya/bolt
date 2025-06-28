import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendEmailVerification, sendTwoFactorCode } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const { type, email, name, code } = await request.json()

    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, name, 'http://localhost:3000/auth/verify-email?token=test')
        break
      case 'verification':
        result = await sendEmailVerification(email, name, code || 'ABC123')
        break
      case '2fa':
        result = await sendTwoFactorCode(email, name, code || '123456')
        break
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json({ message: `${type} email sent successfully` })
    } else {
      return NextResponse.json({ error: 'Failed to send email', details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
