import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

function buildDigest(params: Record<string, string>, salt: string) {
  // order-specific dynamic pricing digest for FlexForms: MD5 of value string plus salt
  const value = Object.values(params).join('') + salt
  return crypto.createHash('md5').update(value).digest('hex')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { product: true } })
  if (!order || !order.product) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const clientAccnum = process.env.CCBILL_CLIENT_ACCNUM || ''
  const clientSubacc = process.env.CCBILL_CLIENT_SUBACC || ''
  const formName = process.env.CCBILL_FORM_NAME || ''
  const flexSalt = process.env.CCBILL_DYN_SALT || ''

  if (!clientAccnum || !clientSubacc || !formName || !flexSalt) {
    return NextResponse.json({ error: 'CCBill env not configured' }, { status: 500 })
  }

  // FlexForms dynamic params
  const initialPrice = (order.amountCents / 100).toFixed(2)
  const initialPeriod = '30' // placeholder required by CCBill even for one-time; not used for single billing
  const currencyCode = order.currencyCode // numeric code like 840
  const params = { initialPrice, initialPeriod, currencyCode, clientAccnum, clientSubacc, formName }
  const formDigest = buildDigest(params, flexSalt)

  const base = 'https://api.ccbill.com/wap-frontflex/flexforms/' + encodeURIComponent(formName)
  const qs = new URLSearchParams({
    initialPrice,
    initialPeriod,
    currencyCode,
    clientAccnum,
    clientSubacc,
    formName,
    formDigest,
    // return URLS
    allowedTypes: '1',
    subscriptionTypeId: '0',
    // custom fields for pass-through
    'X-orderId': order.id
  }).toString()

  const url = `${base}?${qs}`
  return NextResponse.redirect(url)
}


