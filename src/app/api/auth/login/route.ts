import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'username and password required' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || !user.password) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
  const session = await getSession()
  session.user = { id: user.id, username: user.username }
  await session.save()
  return NextResponse.json({ ok: true })
}


