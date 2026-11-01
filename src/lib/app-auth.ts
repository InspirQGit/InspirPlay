import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'

export type AppRole = 'player' | 'venue' | 'trainer' | 'organizer'

export type AppUserRecord = {
  id: string | number
  name: string
  email?: string | null
  role: AppRole
}

type Identity = {
  provider: 'google' | 'facebook' | 'otp'
  providerId: string
  email?: string | null
  mobile?: string | null
  name?: string | null
  avatar?: string | null
  role?: AppRole
}

export function authIntegrations() {
  return {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.AUTH_SECRET),
    facebook: Boolean(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET && process.env.AUTH_SECRET),
    otp: Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_VERIFY_SERVICE_SID &&
      process.env.AUTH_SECRET,
    ),
  }
}

export async function syncAppUser(identity: Identity): Promise<AppUserRecord> {
  const payload = await getPayload({ config })
  const identityKey = `${identity.provider}:${identity.providerId}`
  const existing = await payload.find({
    collection: 'users' as never,
    where: { identityKey: { equals: identityKey } },
    limit: 1,
    overrideAccess: true,
  })
  const data = {
    identityKey,
    provider: identity.provider,
    providerId: identity.providerId,
    email: identity.email || undefined,
    mobile: identity.mobile || undefined,
    name: identity.name || identity.email || identity.mobile || 'InspirQ member',
    avatar: identity.avatar || undefined,
    role: identity.role || 'player',
    status: 'active',
  }
  const existingUser = (existing.docs as unknown as AppUserRecord[])[0]
  if (existingUser) {
    return await payload.update({
      collection: 'users' as never,
      id: existingUser.id,
      data: data as never,
      overrideAccess: true,
    }) as unknown as AppUserRecord
  }
  return await payload.create({
    collection: 'users' as never,
    data: data as never,
    overrideAccess: true,
  }) as unknown as AppUserRecord
}

export async function twilioVerify(identifier: string, code: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const service = process.env.TWILIO_VERIFY_SERVICE_SID
  if (!sid || !token || !service) return false
  const body = new URLSearchParams({ To: identifier, Code: code })
  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${service}/VerificationCheck`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      cache: 'no-store',
    },
  )
  if (!response.ok) return false
  const result = (await response.json()) as { status?: string }
  return result.status === 'approved'
}
