import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { paypalEmail } = await req.json()
  await prisma.user.update({ where: { id: session.user.id }, data: { paypalEmail: paypalEmail || null } })
  return NextResponse.json({ ok: true })
}


