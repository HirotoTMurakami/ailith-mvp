import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('X-orderId') || searchParams.get('orderId')
  const transactionId = searchParams.get('transactionId') || searchParams.get('subscription_id') || undefined
  if (!orderId) return NextResponse.json({ error: 'orderId missing' }, { status: 400 })

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { product: true } })
  if (!order || !order.product) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Mark paid (best-effort). For production, validate via CCBill Datalink/Postback.
  await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID', ccbillTransactionId: transactionId } })

  const token = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  await prisma.downloadToken.create({ data: { token, orderId: order.id, expiresAt } })

  const redirectUrl = `/api/download/${token}`
  return NextResponse.redirect(redirectUrl)
}


