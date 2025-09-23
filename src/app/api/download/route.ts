import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/download  { productId, password }
// If password matches product.downloadPassword, create one-time token and return redirect URL
export async function POST(req: NextRequest) {
  const { productId, password } = await req.json()
  if (!productId || !password) return NextResponse.json({ error: 'productId and password required' }, { status: 400 })
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.approvalStatus !== 'APPROVED') return NextResponse.json({ error: 'Not available' }, { status: 404 })
  if (!product.downloadPassword || product.downloadPassword !== password) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })

  // issue a short-lived download token bound to a fake order (MVP). Create ephemeral pending order if missing.
  const order = await prisma.order.create({ data: { productId: product.id, amountCents: product.priceCents, currencyCode: product.currencyCode, status: 'PAID' } })
  const token = crypto.randomBytes(16).toString('base64url')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  await prisma.downloadToken.create({ data: { token, orderId: order.id, expiresAt } })
  return NextResponse.json({ url: `/api/download/${token}` })
}


