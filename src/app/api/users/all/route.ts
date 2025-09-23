import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, username: true, role: true } })
  return NextResponse.json(users)
}


