import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { t } from '@/lib/i18n'

export default async function Dashboard({ searchParams }: { searchParams: { lang?: string } }) {
  const session = await getSession()
  if (!session.user) return <div className="max-w-4xl mx-auto p-6">Please login</div>
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  const i18n = t(lang)
  const myProducts = await prisma.product.findMany({ where: { sellerId: session.user.id } })
  const myOrders = await prisma.order.findMany({ where: { product: { sellerId: session.user.id } }, orderBy: { createdAt: 'desc' } })
  const totalCents = myOrders.filter(o => (o as any).status === 'PAID').reduce((s, o) => s + o.amountCents, 0)
  const payoutCents = Math.round(totalCents * 0.7)
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{i18n.header.dashboard}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4">
          <div className="text-sm text-gray-600">{lang==='ja'?'総売上':'Gross Sales'}</div>
          <div className="text-xl font-bold">¥{Math.round(totalCents/100)}</div>
        </div>
        <div className="border p-4">
          <div className="text-sm text-gray-600">{lang==='ja'?'支払予定(70%)':'Payout (70%)'}</div>
          <div className="text-xl font-bold">¥{Math.round(payoutCents/100)}</div>
        </div>
      </div>
      <div className="border p-4">
        <div className="font-medium mb-2">{lang==='ja'?'販売履歴':'Sales History'}</div>
        <div className="space-y-2">
          {myOrders.map(o => (
            <div key={o.id} className="text-sm flex items-center justify-between">
              <span>#{o.id.slice(0,6)} — ¥{Math.round(o.amountCents/100)}</span>
              <span className="text-gray-600">{new Date(o.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


