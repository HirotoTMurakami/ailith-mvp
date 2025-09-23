import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { preferredLanguage } = await req.json()
  if (preferredLanguage !== 'ja' && preferredLanguage !== 'en') {
    return NextResponse.json({ error: 'invalid language' }, { status: 400 })
  }
  await prisma.user.update({ where: { id: session.user.id }, data: { preferredLanguage } })
  return NextResponse.json({ ok: true })
}


