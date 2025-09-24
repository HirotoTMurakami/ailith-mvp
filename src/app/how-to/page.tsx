import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function HowToPage({ searchParams }: { searchParams: { lang?: string } }) {
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
              {lang==='ja'?'使い方ガイド':'How to Use Ailith'}
            </h1>
            <p className="text-xl text-gray-600">
              {lang==='ja'?'Ailithでコンテンツを投稿・購入する方法':'Step-by-step guide to posting and purchasing content'}
            </p>
          </div>
          {lang==='ja' ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">🎯 クリエイター向けガイド</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <p className="text-green-700">設定ページでDropbox Access Token、PayPalメールアドレス、言語を登録します。</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <p className="text-green-700">「新規投稿」からタイトル・説明・価格（円）・商品タイプ（動画/画像）・サンプル・Dropboxファイルパスを入力して投稿します。</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <p className="text-green-700">管理人が内容を確認し、note.comの販売URLを設定すると商品が公開されます。</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                    <p className="text-green-700">売上の70%が数営業日内にPayPalで支払われます。ダッシュボードで収益を確認できます。</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">🛒 購入者向けガイド</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <p className="text-blue-700">ホームページでコンテンツを検索・閲覧し、サンプルで内容を確認します。</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <p className="text-blue-700">「note で購入」ボタンからnote.comで安全に決済し、パスワードを取得します。</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <p className="text-blue-700">商品ページでパスワードを入力し、高品質なコンテンツをダウンロードします。</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-3">🎯 Creator's Guide</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <p className="text-green-700">Go to Settings to add your Dropbox Access Token, PayPal email, and language.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <p className="text-green-700">Use "New" to submit title, description, price (JPY), product type (video/image), samples, and Dropbox file path.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <p className="text-green-700">The admin reviews your content and sets the note.com purchase URL to publish your product.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                    <p className="text-green-700">We pay 70% of revenue via PayPal within a few business days. Track your earnings in the Dashboard.</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-3">🛒 Buyer's Guide</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <p className="text-blue-700">Search and browse content on the homepage, preview samples to evaluate quality.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <p className="text-blue-700">Click "Buy with note" to securely purchase on note.com and receive the password.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <p className="text-blue-700">Enter the password on the product page to download the high-quality content.</p>
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


