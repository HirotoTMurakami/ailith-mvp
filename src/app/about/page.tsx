import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function AboutPage({ searchParams }: { searchParams: { lang?: string } }) {
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
              {lang==='ja'?'Ailithとは？':'What is Ailith?'}
            </h1>
            <p className="text-xl text-gray-600">
              {lang==='ja'?'AI生成コンテンツの革新的なマーケットプレイス':'Revolutionary marketplace for AI-generated content'}
            </p>
          </div>

          {lang==='ja' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">🤖 AIコンテンツの新しい時代</h2>
                <p className="text-blue-700 leading-relaxed">
                  Ailithは、AI生成・AI活用動画および画像のためのマーケットプレイスです。クリエイターはYouTubeでサンプル、Dropboxに高品質な本編を保存し、note.comで販売されたパスワードによりダウンロードできる革新的な仕組みを提供します。
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎬</span> クリエイター向け
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      サンプルは無料で視聴可能（YouTube埋め込み）
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      Dropboxで高品質な本編を安全に保管
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      売上の70%をPayPalで迅速還元
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💎</span> 購入者向け
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      購入前にサンプルで内容確認
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      note.comで安全な決済
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      パスワードで即座にダウンロード
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">🚀 特徴</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-purple-700">
                    <div className="font-medium">動画 & 画像対応</div>
                    <div>多様なAIコンテンツに対応</div>
                  </div>
                  <div className="text-purple-700">
                    <div className="font-medium">安全な取引</div>
                    <div>note.com経由の信頼できる決済</div>
                  </div>
                  <div className="text-purple-700">
                    <div className="font-medium">即座のアクセス</div>
                    <div>購入後すぐにダウンロード可能</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">🤖 The New Era of AI Content</h2>
                <p className="text-blue-700 leading-relaxed">
                  Ailith is a revolutionary marketplace for AI-generated and AI-assisted videos and images. Creators host samples on YouTube and high-quality originals on Dropbox, while buyers unlock downloads using passwords sold via note.com.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎬</span> For Creators
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      Samples are freely viewable (YouTube embed)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      Store high-quality originals securely on Dropbox
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      70% payout to sellers via PayPal
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💎</span> For Buyers
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      Preview content with samples before purchase
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      Secure payment through note.com
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      Instant download with password
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">🚀 Features</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-purple-700">
                    <div className="font-medium">Video & Image Support</div>
                    <div>Support for diverse AI content</div>
                  </div>
                  <div className="text-purple-700">
                    <div className="font-medium">Secure Transactions</div>
                    <div>Trusted payments via note.com</div>
                  </div>
                  <div className="text-purple-700">
                    <div className="font-medium">Instant Access</div>
                    <div>Download immediately after purchase</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


