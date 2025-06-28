import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, code } = body

    if (token) {
      // Verify with token (from email link)
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
      
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: hashedToken,
          emailVerificationExpires: {
            gt: new Date(),
          },
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired verification token' },
          { status: 400 }
        )
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      })

      return NextResponse.json({ message: 'Email verified successfully' })
    }

    if (code) {
      // Verify with code (manual entry)
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationCode: code,
          emailVerificationExpires: {
            gt: new Date(),
          },
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
          { status: 400 }
        )
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerificationCode: null,
          emailVerificationExpires: null,
        },
      })

      return NextResponse.json({ message: 'Email verified successfully' })
    }

    return NextResponse.json(
      { error: 'Token or code is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
