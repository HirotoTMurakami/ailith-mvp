import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { t } from '@/lib/i18n'

export default async function Dashboard({ searchParams }: { searchParams: { lang?: string } }) {
  const session = await getSession()
  if (!session.user) return <div className="min-h-screen bg-gray-50/50 flex items-center justify-center"><div className="glass-card p-8 text-center">Please login</div></div>
  
  let lang: 'ja' | 'en' = searchParams?.lang === 'ja' ? 'ja' : 'en'
  
  // Use user's preferred language if logged in and no lang param
  if (!searchParams?.lang) {
    const rows = await prisma.$queryRaw<Array<{ preferredLanguage: string | null }>>`
      SELECT "preferredLanguage" FROM "User" WHERE id = ${session.user.id}
    `
    const pref = rows[0]?.preferredLanguage
    if (pref === 'ja' || pref === 'en') lang = pref
  }
  
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="glass-card p-8 mb-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">{i18n.header.dashboard}</h1>
            <p className="text-xl text-gray-600">
              {lang==='ja'?'売上データと収益を確認しましょう':'Track your sales performance and earnings'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{lang==='ja'?'総売上':'Gross Sales'}</div>
                  <div className="text-2xl font-bold text-blue-600">¥{Math.round(grossCents/100).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{lang==='ja'?'支払予定 (70%)':'Pending Payout (70%)'}</div>
                  <div className="text-2xl font-bold text-green-600">¥{Math.round(remainingPayoutCents/100).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{lang==='ja'?'商品数':'Products'}</div>
                  <div className="text-2xl font-bold text-purple-600">{typed.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📈 {lang==='ja'?'商品別売上':'Sales by Product'}
            </h2>
            <div className="space-y-3">
              {typed.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">📦</span>
                  {lang==='ja'?'まだ商品がありません':'No products yet'}
                </div>
              ) : (
                typed.map(p => (
                  <div key={p.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900 mb-1">{p.title}</div>
                    <div className="text-sm text-gray-600">
                      {(p.salesCount ?? 0)} {lang==='ja'?'売上':'sales'} × ¥{Math.round(p.priceCents/100).toLocaleString()} = <span className="font-semibold text-blue-600">¥{Math.round(((p.salesCount ?? 0) * p.priceCents)/100).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🏦 {lang==='ja'?'支払い履歴':'Payout History'}
            </h2>
            <div className="space-y-3">
              {typedPayouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">💳</span>
                  {lang==='ja'?'支払い履歴はまだありません':'No payout history yet'}
                </div>
              ) : (
                typedPayouts.map(p => {
                  const dt = (p.paidAt ?? p.createdAt)
                  const dateStr = lang==='ja' ? new Date(dt).toLocaleDateString('ja-JP') : new Date(dt).toLocaleDateString('en-US')
                  return (
                    <div key={p.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">{dateStr}</span>
                        <span className="font-semibold text-green-600">+ ¥{Math.round(p.amountCents/100).toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


