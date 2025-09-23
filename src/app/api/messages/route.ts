import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/messages?productId=...  -> list thread (sender->recipient)
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  const msgs = await prisma.message.findMany({ where: { productId }, orderBy: { createdAt: 'asc' } })
  return NextResponse.json(msgs)
}

// POST /api/messages  { productId, recipientId, body }
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { productId, recipientId, body } = await req.json()
  if (!productId || !recipientId || !body) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  const msg = await prisma.message.create({ data: { productId, recipientId, senderId: session.user.id, body } })
  return NextResponse.json(msg, { status: 201 })
}


