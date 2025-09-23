import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  const updated = await prisma.product.update({ where: { id: productId }, data: { approvalStatus: 'REJECTED' } })
  return NextResponse.json({ ok: true, id: updated.id })
}


