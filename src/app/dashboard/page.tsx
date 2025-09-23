import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { t } from '@/lib/i18n'

export default async function Dashboard({ searchParams }: { searchParams: { lang?: string } }) {
  const session = await getSession()
  if (!session.user) return <div className="max-w-4xl mx-auto p-6">Please login</div>
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  const i18n = t(lang)
  const myProducts = await prisma.product.findMany({ where: { sellerId: session.user.id } })
  const typed = myProducts as Array<{ id: string; title: string; priceCents: number; salesCount?: number | null }>
  const grossCents = typed.reduce((sum, p) => sum + (p.priceCents * (p.salesCount ?? 0)), 0)
  const payoutCents = Math.round(grossCents * 0.7)
  // Sum of already paid payouts
  const payouts = await prisma.payout.findMany({ where: { userId: session.user.id, status: 'PAID' }, orderBy: { paidAt: 'desc' } })
  const typedPayouts = payouts as Array<{ id: string; amountCents: number; paidAt: Date | null; createdAt: Date }>
  const paidTotalCents = typedPayouts.reduce((sum, p) => sum + p.amountCents, 0)
  const remainingPayoutCents = Math.max(payoutCents - paidTotalCents, 0)
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{i18n.header.dashboard}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4">
          <div className="text-sm text-gray-600">{lang==='ja'?'総売上':'Gross Sales'}</div>
          <div className="text-xl font-bold">¥{Math.round(grossCents/100)}</div>
        </div>
        <div className="border p-4">
          <div className="text-sm text-gray-600">{lang==='ja'?'支払予定(70%)':'Payout (70%)'}</div>
          <div className="text-xl font-bold">¥{Math.round(remainingPayoutCents/100)}</div>
        </div>
      </div>
      <div className="border p-4">
        <div className="font-medium mb-2">{lang==='ja'?'各商品の売上':'Sales by Product'}</div>
        <div className="space-y-2">
          {typed.map(p => (
            <div key={p.id} className="text-sm flex items-center justify-between">
              <span>{p.title}</span>
              <span className="text-gray-700">{(p.salesCount ?? 0)} × ¥{Math.round(p.priceCents/100)} = ¥{Math.round(((p.salesCount ?? 0) * p.priceCents)/100)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border p-4">
        <div className="font-medium mb-2">{lang==='ja'?'支払い履歴':'Payout History'}</div>
        <div className="space-y-2">
          {typedPayouts.length === 0 && (
            <div className="text-sm text-gray-600">{lang==='ja'?'支払い履歴はまだありません':'No payout history yet'}</div>
          )}
          {typedPayouts.map(p => {
            const dt = (p.paidAt ?? p.createdAt)
            const dateStr = lang==='ja' ? new Date(dt).toLocaleString('ja-JP') : new Date(dt).toLocaleString('en-US')
            return (
              <div key={p.id} className="text-sm flex items-center justify-between">
                <span>{dateStr}</span>
                <span className="text-gray-700">¥{Math.round(p.amountCents/100)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


