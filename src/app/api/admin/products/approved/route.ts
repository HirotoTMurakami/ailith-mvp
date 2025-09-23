import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const all = await prisma.product.findMany({ orderBy: { createdAt: 'asc' }, include: { seller: true } })
  const approved = all.filter(p => (p as unknown as { approvalStatus?: string }).approvalStatus === 'APPROVED')
  const shaped = approved.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    priceCents: p.priceCents,
    currencyCode: p.currencyCode,
    youtubeUrl: p.youtubeUrl,
    dropboxPath: p.dropboxPath,
    noteUrl: (p as unknown as { noteUrl?: string | null }).noteUrl ?? null,
    downloadPassword: (p as unknown as { downloadPassword?: string | null }).downloadPassword ?? null,
    seller: p.seller ? { id: p.seller.id, username: p.seller.username, dropboxAccessToken: p.seller.dropboxAccessToken ?? null } : null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  }))
  return NextResponse.json(shaped)
}


