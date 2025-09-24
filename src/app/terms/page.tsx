import Link from 'next/link'

export default function TermsPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lang==='ja'?'利用規約':'Terms of Use'}</h1>
        <Link href={`?lang=${lang==='ja'?'en':'ja'}`} className="underline text-sm">{lang==='ja'?'English':'日本語'}</Link>
      </div>
      {lang==='ja' ? (
        <div className="space-y-3 text-gray-700">
          <p>本サービスは、投稿者と購入者の間のコンテンツ取引を仲介します。投稿者はコンテンツの権利および適法性を保証し、購入後の返金は原則行いません。</p>
          <p>利用者は本規約、法令、公序良俗に反しない範囲で本サービスを利用するものとします。</p>
        </div>
      ) : (
        <div className="space-y-3 text-gray-700">
          <p>This service facilitates content transactions between sellers and buyers. Sellers warrant rights and legality of content; refunds are not provided after purchase in principle.</p>
          <p>Users must comply with these terms, applicable laws, and public order and morals.</p>
        </div>
      )}
    </main>
  )
}


