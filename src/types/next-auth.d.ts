import type { DefaultSession } from 'next-auth'
import type { AppRole } from '@/lib/app-auth'

declare module 'next-auth' {
  interface User {
    role?: AppRole
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role?: AppRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole
  }
}
