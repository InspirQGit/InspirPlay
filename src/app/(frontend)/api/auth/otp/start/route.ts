import { authIntegrations } from '@/lib/app-auth'

function validIdentifier(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\+[1-9]\d{7,14}$/.test(value)
}

export async function POST(request: Request) {
  const { otp } = authIntegrations()
  if (!otp) return Response.json({ error: 'OTP configuration is pending.' }, { status: 503 })
  const body = (await request.json()) as { identifier?: string }
  const identifier = body.identifier?.trim() || ''
  if (!validIdentifier(identifier)) {
    return Response.json({ error: 'Enter a valid email address or mobile number with country code.' }, { status: 400 })
  }
  const sid = process.env.TWILIO_ACCOUNT_SID!
  const token = process.env.TWILIO_AUTH_TOKEN!
  const service = process.env.TWILIO_VERIFY_SERVICE_SID!
  const form = new URLSearchParams({ To: identifier, Channel: identifier.includes('@') ? 'email' : 'sms' })
  const response = await fetch(`https://verify.twilio.com/v2/Services/${service}/Verifications`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
    cache: 'no-store',
  })
  if (!response.ok) return Response.json({ error: 'Unable to send a verification code.' }, { status: 502 })
  return Response.json({ ok: true })
}
