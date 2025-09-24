import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  const filtered = q
    ? products.filter(p => (p.title + ' ' + (p.description || '')).toLowerCase().includes(q.toLowerCase()))
    : products
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const rows = await prisma.$queryRaw<Array<{ dropboxAccessToken: string | null }>>`
      SELECT "dropboxAccessToken" FROM "User" WHERE id = ${session.user.id}
    `
    const meToken = rows[0]?.dropboxAccessToken ?? null
    if (!meToken) {
      return NextResponse.json({ error: 'Seller Dropbox Access Token is required. Please set it in Settings.' }, { status: 400 })
    }
    const body = await req.json()
    const { title, description, priceYen, youtubeUrl, dropboxPath, productType, sampleImageUrls } = body
    if (!title || !dropboxPath || !priceYen) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const downloadPassword = crypto.randomBytes(8).toString('base64url')
    const data = {
      title,
      description: description ?? '',
      priceCents: Math.round(Number(priceYen) * 100),
      currencyCode: '392',
      youtubeUrl: youtubeUrl || null,
      dropboxPath,
      productType: (productType === 'IMAGE' ? 'IMAGE' : 'VIDEO'),
      sampleImageUrls: Array.isArray(sampleImageUrls) ? sampleImageUrls.slice(0, 10) : [],
      sellerId: session.user.id,
      approvalStatus: 'PENDING',
      downloadPassword
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = await prisma.product.create({ data: data as any })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}


