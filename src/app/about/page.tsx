import Link from 'next/link'

export default function AboutPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lang==='ja'?'Ailithとは？':'What is Ailith?'}</h1>
        <Link href={`?lang=${lang==='ja'?'en':'ja'}`} className="underline text-sm">{lang==='ja'?'English':'日本語'}</Link>
      </div>
      {lang==='ja' ? (
        <div className="space-y-3 text-gray-700">
          <p>Ailithは、AI生成・AI活用動画のためのマーケットプレイスです。投稿者はYouTubeでサンプル、Dropboxに本編を保存し、noteで販売されたパスワードによりダウンロードできる仕組みを提供します。</p>
          <ul className="list-disc ml-5">
            <li>サンプルは無料で視聴可能（YouTube埋め込み）</li>
            <li>購入後、Dropboxの一時リンクで本編をダウンロード</li>
            <li>売上の70%をPayPalで還元</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3 text-gray-700">
          <p>Ailith is a marketplace for AI-generated and AI-assisted videos. Sellers host samples on YouTube and originals on Dropbox, and buyers unlock downloads using a password sold via note.</p>
          <ul className="list-disc ml-5">
            <li>Samples are freely viewable (YouTube embed)</li>
            <li>After purchase, download the original via a Dropbox temporary link</li>
            <li>70% payout to sellers via PayPal</li>
          </ul>
        </div>
      )}
    </main>
  )
}


