import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  const role = (me?.role || '').toUpperCase()
  if (role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { userId, amountCents } = await req.json()
  if (!userId || typeof amountCents !== 'number' || amountCents <= 0) {
    return NextResponse.json({ error: 'userId and positive amountCents required' }, { status: 400 })
  }

  await prisma.payout.create({
    data: {
      userId,
      amountCents,
      status: 'PAID',
      paidAt: new Date()
    }
  })

  return NextResponse.json({ ok: true })
}


