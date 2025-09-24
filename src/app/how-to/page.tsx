import Link from 'next/link'

export default function HowToPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lang==='ja'?'使い方':'How to use'}</h1>
        <Link href={`?lang=${lang==='ja'?'en':'ja'}`} className="underline text-sm">{lang==='ja'?'English':'日本語'}</Link>
      </div>
      {lang==='ja' ? (
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>設定ページでDropbox Access TokenとPayPalメールアドレス、言語を登録します。</li>
          <li>「新規投稿」からタイトル・説明・価格（円）・YouTubeサンプルURL・Dropboxファイルパスを入力して投稿します。</li>
          <li>管理人が承認し、noteの販売URLを設定すると公開されます。</li>
          <li>購入者はnoteで購入したパスワードを商品ページに入力し、ダウンロードできます。</li>
          <li>売上の70%が数営業日内にPayPalで支払われます。</li>
        </ol>
      ) : (
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>Go to Settings to add your Dropbox Access Token, PayPal email, and language.</li>
          <li>Use “New” to submit title, description, price (JPY), YouTube sample URL, and Dropbox file path.</li>
          <li>The admin approves your product and sets the note purchase URL to publish.</li>
          <li>Buyers enter the note-purchased password on the product page to download.</li>
          <li>We pay 70% of revenue via PayPal within a few business days.</li>
        </ol>
      )}
    </main>
  )
}


