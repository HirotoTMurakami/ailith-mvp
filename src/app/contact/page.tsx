import Link from 'next/link'

export default function ContactPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lang==='ja'?'お問い合わせ':'Contact'}</h1>
        <Link href={`?lang=${lang==='ja'?'en':'ja'}`} className="underline text-sm">{lang==='ja'?'English':'日本語'}</Link>
      </div>
      {lang==='ja' ? (
        <div className="space-y-3 text-gray-700">
          <p>ご不明点やご要望は、以下のメールアドレスにご連絡ください。</p>
          <p>メール: support@example.com</p>
        </div>
      ) : (
        <div className="space-y-3 text-gray-700">
          <p>For questions or requests, please contact us at the email below.</p>
          <p>Email: support@example.com</p>
        </div>
      )}
    </main>
  )
}


