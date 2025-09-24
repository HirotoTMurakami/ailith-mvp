import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function TermsPage({ searchParams }: { searchParams: { lang?: string } }) {
  const session = await getSession()
  let lang: 'ja' | 'en' = searchParams?.lang === 'ja' ? 'ja' : 'en'
  
  // Use user's preferred language if logged in and no lang param
  if (session.user && !searchParams?.lang) {
    const rows = await prisma.$queryRaw<Array<{ preferredLanguage: string | null }>>`
      SELECT "preferredLanguage" FROM "User" WHERE id = ${session.user.id}
    `
    const pref = rows[0]?.preferredLanguage
    if (pref === 'ja' || pref === 'en') lang = pref
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="glass-card p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              {lang==='ja'?'利用規約':'Terms of Use'}
            </h1>
            <p className="text-xl text-gray-600">
              {lang==='ja'?'サービス利用時の規約・条件':'Rules and conditions for using our service'}
            </p>
          </div>

          {lang==='ja' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">📋 サービス概要</h2>
                <p className="text-blue-700 leading-relaxed">
                  本サービスは、投稿者と購入者の間のコンテンツ取引を仲介します。投稿者はコンテンツの権利および適法性を保証し、購入後の返金は原則行いません。
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h2 className="text-xl font-semibold text-red-800 mb-3">🚫 遵守事項</h2>
                <p className="text-red-700 leading-relaxed">
                  利用者は本規約、法令、公序良俗に反しない範囲で本サービスを利用するものとします。違反が確認された場合、アカウント停止等の措置を講じる場合があります。
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">💰 料金・支払い</h2>
                <p className="text-green-700 leading-relaxed">
                  売上の70%をクリエイターに還元し、残り30%をプラットフォーム運営費として利用します。支払いはPayPal経由で数営業日内に行われます。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📞 お問い合わせ</h2>
                <p className="text-gray-700 leading-relaxed">
                  規約に関するご質問や詳細については、お問い合わせページよりご連絡ください。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">📋 Service Overview</h2>
                <p className="text-blue-700 leading-relaxed">
                  This service facilitates content transactions between sellers and buyers. Sellers warrant rights and legality of content; refunds are not provided after purchase in principle.
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h2 className="text-xl font-semibold text-red-800 mb-3">🚫 Compliance</h2>
                <p className="text-red-700 leading-relaxed">
                  Users must comply with these terms, applicable laws, and public order and morals. Violations may result in account suspension or other measures.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">💰 Fees & Payments</h2>
                <p className="text-green-700 leading-relaxed">
                  We pay 70% of revenue to creators and use the remaining 30% for platform operations. Payments are made via PayPal within a few business days.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📞 Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these terms or detailed inquiries, please contact us via the contact page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}