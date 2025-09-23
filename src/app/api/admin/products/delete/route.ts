import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  // Soft-delete: make it not appear on homepage by rejecting approval
  const updated = await prisma.product.update({ where: { id }, data: { approvalStatus: 'REJECTED', noteUrl: null } })
  return NextResponse.json({ ok: true, product: updated })
}


