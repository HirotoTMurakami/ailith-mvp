import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import crypto from 'crypto'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
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
    const { title, description, priceCents, currencyCode = '840', youtubeUrl, dropboxPath } = body
    if (!title || !youtubeUrl || !dropboxPath || !priceCents) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const downloadPassword = crypto.randomBytes(8).toString('base64url')
    const data = {
      title,
      description: description ?? '',
      priceCents: Number(priceCents),
      currencyCode,
      youtubeUrl,
      dropboxPath,
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


