import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTwoFactorCode, generateTwoFactorCode } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate 2FA code
    const twoFactorCode = generateTwoFactorCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Store 2FA code in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode,
        twoFactorExpires: expiresAt,
      },
    })

    // Send 2FA code via email
    await sendTwoFactorCode(user.email, user.name || 'User', twoFactorCode)

    return NextResponse.json({ message: '2FA code sent successfully' })
  } catch (error) {
    console.error('Send 2FA error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
