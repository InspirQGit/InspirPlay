import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'
import { syncAppUser, twilioVerify, type AppRole } from '@/lib/app-auth'

if (
  !process.env.AUTH_URL &&
  process.env.NEXT_PUBLIC_SITE_URL &&
  !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
) {
  process.env.AUTH_URL = process.env.NEXT_PUBLIC_SITE_URL
}

export const { handlers, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [
    Google,
    Facebook,
    Credentials({
      name: 'OTP',
      credentials: {
        identifier: {},
        code: {},
        name: {},
        role: {},
      },
      async authorize(credentials) {
        const identifier = String(credentials.identifier || '').trim()
        const code = String(credentials.code || '').trim()
        if (!identifier || !code || !(await twilioVerify(identifier, code))) return null
        const isEmail = identifier.includes('@')
        const user = await syncAppUser({
          provider: 'otp',
          providerId: identifier.toLowerCase(),
          email: isEmail ? identifier.toLowerCase() : undefined,
          mobile: isEmail ? undefined : identifier,
          name: String(credentials.name || '').trim() || undefined,
          role: (String(credentials.role || 'player') as AppRole),
        })
        return { id: String(user.id), name: user.name, email: user.email || null, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && account.provider !== 'credentials') {
        const provider = account.provider === 'facebook' ? 'facebook' : 'google'
        const appUser = await syncAppUser({
          provider,
          providerId: account.providerAccountId,
          email: user.email,
          name: user.name,
          avatar: user.image,
        })
        token.sub = String(appUser.id)
        token.role = appUser.role
      } else if (user) {
        token.sub = user.id
        token.role = (user as typeof user & { role?: AppRole }).role || 'player'
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
        ;(session.user as typeof session.user & { role?: AppRole }).role = (token.role as AppRole) || 'player'
      }
      return session
    },
  },
})
