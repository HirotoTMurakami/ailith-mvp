import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { username, password, dropboxAccessToken } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'username and password required' }, { status: 400 })
  }
  const exists = await prisma.user.findUnique({ where: { username } })
  if (exists) return NextResponse.json({ error: 'username taken' }, { status: 409 })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
      dropboxAccessToken: dropboxAccessToken || null
    }
  })
  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } }, { status: 201 })
}


