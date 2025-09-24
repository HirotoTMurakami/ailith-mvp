import Link from 'next/link'

export default function PrivacyPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lang==='ja'?'プライバシーポリシー':'Privacy Policy'}</h1>
        <Link href={`?lang=${lang==='ja'?'en':'ja'}`} className="underline text-sm">{lang==='ja'?'English':'日本語'}</Link>
      </div>
      {lang==='ja' ? (
        <div className="space-y-3 text-gray-700">
          <p>当サイトは、サービス提供のために必要な範囲で個人情報を取得・利用します。購入処理や支払い管理、サポート対応のために必要な情報のみを取り扱います。</p>
          <p>第三者提供は、法令に基づく場合を除き行いません。詳細はお問い合わせよりご連絡ください。</p>
        </div>
      ) : (
        <div className="space-y-3 text-gray-700">
          <p>We collect and use personal data only to the extent necessary to provide our services, including purchase processing, payout management, and support.</p>
          <p>We do not share personal data with third parties except as required by law. For inquiries, contact us via the contact page.</p>
        </div>
      )}
    </main>
  )
}


