import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function ContactPage({ searchParams }: { searchParams: { lang?: string } }) {
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
              {lang==='ja'?'お問い合わせ':'Contact Us'}
            </h1>
            <p className="text-xl text-gray-600">
              {lang==='ja'?'ご質問・ご要望をお気軽にお寄せください':'Feel free to reach out with questions or feedback'}
            </p>
          </div>

          {lang==='ja' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">📧 メールでのお問い合わせ</h2>
                <p className="text-blue-700 leading-relaxed mb-4">
                  ご不明点やご要望は、以下のメールアドレスにご連絡ください。できる限り迅速に対応いたします。
                </p>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📮</span>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a href="mailto:marksman.gk@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        marksman.gk@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">🤝 サポート内容</h2>
                <ul className="text-green-700 leading-relaxed space-y-2">
                  <li>• アカウント・ログインに関するお問い合わせ</li>
                  <li>• 商品投稿・販売に関するご質問</li>
                  <li>• 支払い・収益に関するお問い合わせ</li>
                  <li>• 技術的な問題のサポート</li>
                  <li>• サービス改善のご提案</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h2 className="text-xl font-semibold text-yellow-800 mb-3">⏰ 返信時間</h2>
                <p className="text-yellow-700 leading-relaxed">
                  通常、営業日以内にご返信いたします。お急ぎの場合はメールの件名に「急用」とご記載ください。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">📧 Email Contact</h2>
                <p className="text-blue-700 leading-relaxed mb-4">
                  For questions or requests, please contact us at the email below. We'll respond as quickly as possible.
                </p>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📮</span>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a href="mailto:marksman.gk@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        marksman.gk@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">🤝 Support Areas</h2>
                <ul className="text-green-700 leading-relaxed space-y-2">
                  <li>• Account & login assistance</li>
                  <li>• Product posting & sales questions</li>
                  <li>• Payment & earnings inquiries</li>
                  <li>• Technical support</li>
                  <li>• Service improvement suggestions</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h2 className="text-xl font-semibold text-yellow-800 mb-3">⏰ Response Time</h2>
                <p className="text-yellow-700 leading-relaxed">
                  We typically respond within one business day. For urgent matters, please include "URGENT" in your email subject.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}