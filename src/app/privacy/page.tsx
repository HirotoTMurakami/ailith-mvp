import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function PrivacyPage({ searchParams }: { searchParams: { lang?: string } }) {
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
              {lang==='ja'?'プライバシーポリシー':'Privacy Policy'}
            </h1>
            <p className="text-xl text-gray-600">
              {lang==='ja'?'個人情報の取り扱いについて':'How we handle your personal information'}
            </p>
          </div>

          {lang==='ja' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">🔒 情報の取得・利用</h2>
                <p className="text-blue-700 leading-relaxed">
                  当サイトは、サービス提供のために必要な範囲で個人情報を取得・利用します。購入処理や支払い管理、サポート対応のために必要な情報のみを取り扱います。
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">🛡️ 第三者への提供</h2>
                <p className="text-green-700 leading-relaxed">
                  第三者提供は、法令に基づく場合を除き行いません。お客様の大切な情報を適切に保護いたします。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📞 お問い合わせ</h2>
                <p className="text-gray-700 leading-relaxed">
                  プライバシーポリシーに関するご質問は、お問い合わせページよりご連絡ください。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">🔒 Data Collection & Use</h2>
                <p className="text-blue-700 leading-relaxed">
                  We collect and use personal data only to the extent necessary to provide our services, including purchase processing, payout management, and customer support.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">🛡️ Third-Party Sharing</h2>
                <p className="text-green-700 leading-relaxed">
                  We do not share personal data with third parties except as required by law. Your information is protected and handled with care.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📞 Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about this privacy policy, please contact us via the contact page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


