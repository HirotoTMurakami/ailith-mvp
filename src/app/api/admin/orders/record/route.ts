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
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 })
  await prisma.product.update({ where: { id: productId }, data: { salesCount: { increment: 1 } } })
  const order = await prisma.order.create({ data: { productId, amountCents: product.priceCents, currencyCode: '392', status: 'PAID' } })
  return NextResponse.json({ ok: true, order })
}


