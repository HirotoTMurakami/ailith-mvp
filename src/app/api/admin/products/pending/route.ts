import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const all = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } })
  const pending = all.filter(p => (p as unknown as { approvalStatus?: string }).approvalStatus === 'PENDING')
  return NextResponse.json(pending)
}


