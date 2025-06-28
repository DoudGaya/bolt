import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { UserRegisterSchema } from '@/lib/validations'
import { sendWelcomeEmail, generateVerificationCode, createVerificationUrl } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = UserRegisterSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token and code
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    const verificationCode = generateVerificationCode()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerificationToken: hashedToken,
        emailVerificationCode: verificationCode,
        emailVerificationExpires: verificationExpires,
      }
    })

    // Create verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationUrl = createVerificationUrl(baseUrl, verificationToken)

    // Send welcome email with verification
    try {
      await sendWelcomeEmail(email, name, verificationUrl)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    // Remove password and sensitive data from response
    const { password: _, emailVerificationToken: __, emailVerificationCode: ___, ...userWithoutSensitiveData } = user

    return NextResponse.json({
      message: 'Account created successfully! Please check your email to verify your account.',
      user: userWithoutSensitiveData
    })
  } catch (error) {
    console.error('Registration error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}