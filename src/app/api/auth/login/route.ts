import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { username } = await req.json()
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })
  let user = await prisma.user.findUnique({ where: { username } })
  if (!user) user = await prisma.user.create({ data: { username } })
  const session = await getSession()
  session.user = { id: user.id, username: user.username }
  await session.save()
  return NextResponse.json({ ok: true, user })
}


