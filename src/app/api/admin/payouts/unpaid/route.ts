import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const me = await prisma.user.findUnique({ where: { id: session.user.id } })
    const role = (me?.role || '').toUpperCase()
    if (role !== 'ADMIN') return NextResponse.json({ error: 'forbidden', userRole: me?.role }, { status: 403 })

    const allUsers = await prisma.user.findMany({
      where: { role: { in: ['SELLER', 'ADMIN'] }, paypalEmail: { not: null } }
    })

    const allProducts = await prisma.product.findMany()
    const approvedProducts = allProducts.filter(p => (p as unknown as { approvalStatus?: string }).approvalStatus === 'APPROVED')

    const unpaidPayouts: Array<{ userId: string; username: string; paypalEmail: string | null; unpaidAmountCents: number; totalSalesCents: number; paidAmountCents: number; }> = []
    for (const user of allUsers) {
      if (!user.paypalEmail) continue
      const userProducts = approvedProducts.filter(p => (p as unknown as { sellerId?: string }).sellerId === user.id)
      let totalSalesCents = 0
      for (const product of userProducts) {
        const salesCount = (product as unknown as { salesCount?: number }).salesCount || 0
        totalSalesCents += salesCount * (product as unknown as { priceCents: number }).priceCents
      }
      if (totalSalesCents === 0) continue

      const payoutCents = Math.round(totalSalesCents * 0.7)
      const existingPayouts = await prisma.payout.findMany({ where: { userId: user.id, status: 'PAID' } })
      const paidAmountCents = existingPayouts.reduce((sum, p) => sum + p.amountCents, 0)
      const unpaidAmountCents = payoutCents - paidAmountCents
      if (unpaidAmountCents > 0) {
        unpaidPayouts.push({
          userId: user.id,
          username: user.username,
          paypalEmail: user.paypalEmail,
          unpaidAmountCents,
          totalSalesCents,
          paidAmountCents
        })
      }
    }

    return NextResponse.json(unpaidPayouts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


