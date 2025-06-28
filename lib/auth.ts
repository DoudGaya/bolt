import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { sendTwoFactorCode, generateTwoFactorCode } from './mail'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password!
        )

        if (!isPasswordValid) {
          return null
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorCode) {
            // Generate and send 2FA code
            const code = generateTwoFactorCode()
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

            await prisma.user.update({
              where: { id: user.id },
              data: {
                twoFactorCode: code,
                twoFactorExpires: expiresAt,
              },
            })

            await sendTwoFactorCode(user.email, user.name || 'User', code)
            
            throw new Error('2FA_REQUIRED')
          }

          // Verify 2FA code
          if (user.twoFactorCode !== credentials.twoFactorCode || 
              !user.twoFactorExpires || 
              user.twoFactorExpires < new Date()) {
            throw new Error('Invalid or expired 2FA code')
          }

          // Clear 2FA code after successful verification
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twoFactorCode: null,
              twoFactorExpires: null,
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/signin',
  }
}