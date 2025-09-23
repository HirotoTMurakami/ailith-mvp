import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


async function getDropboxTemporaryLink(path: string): Promise<string> {
  const token = process.env.DROPBOX_ACCESS_TOKEN
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

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const record = await prisma.downloadToken.findUnique({ where: { token: params.token }, include: { order: { include: { product: true } } } })
  if (!record || record.used) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (record.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: 'Token expired' }, { status: 410 })

  const product = record.order.product
  if (!product) return NextResponse.json({ error: 'Product missing' }, { status: 500 })

  const link = await getDropboxTemporaryLink(product.dropboxPath)
  // Mark token as used (one-time)
  await prisma.downloadToken.update({ where: { id: record.id }, data: { used: true } })
  return NextResponse.redirect(link)
}


