import { authIntegrations } from '@/lib/app-auth'

export async function GET() {
  return Response.json(authIntegrations())
}
