"use client"
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function Footer() {
  const search = useSearchParams()
  const lang = search.get('lang') === 'ja' ? 'ja' : 'en'
  return (
    <footer className="mt-20 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm flex items-center justify-center">
              A
            </div>
            <div>
              <div className="font-semibold text-gray-800">Ailith</div>
              <div className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link href={`/privacy?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {lang==='ja'?'プライバシーポリシー':'Privacy Policy'}
            </Link>
            <Link href={`/terms?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {lang==='ja'?'利用規約':'Terms of Use'}
            </Link>
            <Link href={`/contact?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {lang==='ja'?'お問い合わせ':'Contact'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}


