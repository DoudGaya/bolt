import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendEmailVerification, generateVerificationCode } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with new verification code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationCode: verificationCode,
        emailVerificationExpires: expiresAt,
      },
    })

    // Send verification email
    try {
      const result = await sendEmailVerification(user.email, user.name || 'User', verificationCode)
      
      if (!result.success) {
        console.error('Email service error:', result.error)
        return NextResponse.json(
          { error: 'Failed to send verification email. Please try again.' },
          { status: 500 }
        )
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Verification code sent successfully' })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
