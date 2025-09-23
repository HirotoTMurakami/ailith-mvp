import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { dropboxAccessToken: true, paypalEmail: true, preferredLanguage: true }
  })
  return NextResponse.json({ profile: user })
}


