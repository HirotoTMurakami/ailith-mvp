import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ user: null })
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } })
  console.log('Auth me - Session:', session.user)
  console.log('Auth me - DB User:', dbUser)
  return NextResponse.json({ 
    user: { ...session.user, role: dbUser?.role },
    debug: { sessionRole: (session.user as unknown as { role?: string }).role ?? 'not set', dbRole: dbUser?.role }
  })
}


