import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Minimal IPN endpoint placeholder (CCBill Datalink/Postback) - optional for MVP manual testing
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const data = await req.formData().catch(() => null)
  if (!data) return NextResponse.json({ ok: true })
  const orderId = (data.get('X-orderId') || data.get('orderId')) as string | null
  const subscription_id = (data.get('subscription_id') as string | null) || undefined
  if (orderId) {
    await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID', ccbillTransactionId: subscription_id } }).catch(() => {})
  }
  return NextResponse.json({ ok: true })
}


