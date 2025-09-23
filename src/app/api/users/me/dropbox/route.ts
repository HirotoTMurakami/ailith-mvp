import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { dropboxAccessToken } = await req.json()
  if (!dropboxAccessToken) return NextResponse.json({ error: 'dropboxAccessToken required' }, { status: 400 })
  await prisma.user.update({ where: { id: session.user.id }, data: { dropboxAccessToken } })
  return NextResponse.json({ ok: true })
}


