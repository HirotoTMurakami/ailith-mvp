import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, priceCents, currencyCode = '840', youtubeUrl, dropboxPath } = body
    if (!title || !youtubeUrl || !dropboxPath || !priceCents) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const product = await prisma.product.create({
      data: { title, description: description ?? '', priceCents: Number(priceCents), currencyCode, youtubeUrl, dropboxPath }
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}


