import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { productId, noteUrl } = await req.json()
  if (!productId || !noteUrl) return NextResponse.json({ error: 'productId and noteUrl required' }, { status: 400 })
  const updated = await prisma.product.update({ where: { id: productId }, data: { noteUrl, approvalStatus: ProductStatus.APPROVED } })
  return NextResponse.json(updated)
}


