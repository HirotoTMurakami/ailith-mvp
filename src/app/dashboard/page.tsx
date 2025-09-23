import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { t } from '@/lib/i18n'

export default async function Dashboard({ searchParams }: { searchParams: { lang?: string } }) {
  const session = await getSession()
  if (!session.user) return <div className="max-w-4xl mx-auto p-6">Please login</div>
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  const i18n = t(lang)
  const myProducts = await prisma.product.findMany({ where: { sellerId: session.user.id } })
  const grossCents = myProducts.reduce((sum, p) => sum + (p.priceCents * ((p as any).salesCount ?? 0)), 0)
  const payoutCents = Math.round(grossCents * 0.7)
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
          <div className="text-xl font-bold">¥{Math.round(payoutCents/100)}</div>
        </div>
      </div>
      <div className="border p-4">
        <div className="font-medium mb-2">{lang==='ja'?'各商品の売上':'Sales by Product'}</div>
        <div className="space-y-2">
          {myProducts.map(p => (
            <div key={p.id} className="text-sm flex items-center justify-between">
              <span>{p.title}</span>
              <span className="text-gray-700">{((p as any).salesCount ?? 0)} × ¥{Math.round(p.priceCents/100)} = ¥{Math.round((((p as any).salesCount ?? 0) * p.priceCents)/100)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


