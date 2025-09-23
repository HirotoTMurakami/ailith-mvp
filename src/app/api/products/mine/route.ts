import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const items = await prisma.product.findMany({ where: { sellerId: session.user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}


