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
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}


