"use client"
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function Footer() {
  const search = useSearchParams()
  const lang = search.get('lang') === 'ja' ? 'ja' : 'en'
  return (
    <footer className="border-t mt-10">
      <div className="max-w-5xl mx-auto p-4 text-sm flex flex-wrap items-center gap-4 justify-between">
        <div className="text-gray-600">© {new Date().getFullYear()} Ailith</div>
        <nav className="flex gap-4">
          <Link href={`/privacy?lang=${lang}`} className="hover:underline">{lang==='ja'?'プライバシーポリシー':'Privacy Policy'}</Link>
          <Link href={`/terms?lang=${lang}`} className="hover:underline">{lang==='ja'?'利用規約':'Terms of Use'}</Link>
          <Link href={`/contact?lang=${lang}`} className="hover:underline">{lang==='ja'?'お問い合わせ':'Contact'}</Link>
        </nav>
      </div>
    </footer>
  )
}


