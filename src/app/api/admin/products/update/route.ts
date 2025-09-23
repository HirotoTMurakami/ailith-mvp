import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { id, title, description, priceYen, youtubeUrl, dropboxPath, noteUrl, salesCount } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const data: {
    title?: string
    description?: string
    priceCents?: number
    youtubeUrl?: string
    dropboxPath?: string
    noteUrl?: string | null
    salesCount?: number
  } = {}
  if (typeof title === 'string') data.title = title
  if (typeof description === 'string') data.description = description
  if (typeof priceYen === 'number') data.priceCents = Math.round(priceYen * 100)
  if (typeof youtubeUrl === 'string') data.youtubeUrl = youtubeUrl
  if (typeof dropboxPath === 'string') data.dropboxPath = dropboxPath
  if (typeof noteUrl === 'string' || noteUrl === null) data.noteUrl = noteUrl ?? null
  if (typeof salesCount === 'number') data.salesCount = salesCount
  const updated = await prisma.product.update({ where: { id }, data })
  return NextResponse.json({ ok: true, product: updated })
}


