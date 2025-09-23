import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


async function getDropboxTemporaryLink(path: string, userToken?: string | null): Promise<string> {
  const token = userToken || process.env.DROPBOX_ACCESS_TOKEN
  if (!token) throw new Error('DROPBOX_ACCESS_TOKEN not configured')
  const res = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ path })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Dropbox error: ${text}`)
  }
  const json = await res.json()
  return json.link as string
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const record = await prisma.downloadToken.findUnique({ where: { token } })
  if (!record || record.used) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (record.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: 'Token expired' }, { status: 410 })

  const order = await prisma.order.findUnique({ where: { id: record.orderId } })
  if (!order?.productId) return NextResponse.json({ error: 'Product missing' }, { status: 500 })
  const productRow = await prisma.product.findUnique({ where: { id: order.productId } })
  const product = productRow as { dropboxPath: string; sellerId?: string | null } | null
  if (!product) return NextResponse.json({ error: 'Product missing' }, { status: 500 })
  const sellerId = product.sellerId ?? null
  let sellerToken: string | null = null
  if (sellerId) {
    const rows = await prisma.$queryRaw<Array<{ dropboxAccessToken: string | null }>>`
      SELECT "dropboxAccessToken" FROM "User" WHERE id = ${sellerId}
    `
    sellerToken = rows[0]?.dropboxAccessToken ?? null
  }
  const link = await getDropboxTemporaryLink(product.dropboxPath, sellerToken)
  await prisma.downloadToken.update({ where: { id: record.id }, data: { used: true } })
  return NextResponse.redirect(link)
}


