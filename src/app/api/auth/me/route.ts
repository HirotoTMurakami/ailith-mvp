import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ user: null })
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } })
  return NextResponse.json({ user: { ...session.user, role: dbUser?.role } })
}


