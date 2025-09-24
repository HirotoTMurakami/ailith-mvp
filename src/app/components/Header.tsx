"use client"
import useSWR from 'swr'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { t, getLangFromSearch } from '@/lib/i18n'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function Header() {
  const search = useSearchParams()
  const lang = getLangFromSearch(search)
  const i18n = t(lang)
  const { data } = useSWR('/api/auth/me', fetcher, { suspense: true })
  const user = data?.user as { username: string; role?: string } | undefined
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  return (
    <header className="floating-header sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href={`/?lang=${lang}`} className="font-bold flex items-center gap-3 text-gray-800 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg flex items-center justify-center shadow-lg">
            A
          </div>
          <span className="gradient-text text-xl">{i18n.header.brand}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href={`/about?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
            {lang==='ja'?'Ailithとは？':'About'}
          </Link>
          <Link href={`/how-to?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
            {lang==='ja'?'使い方':'How to'}
          </Link>
          {user ? (
            <>
              <Link href={`/products/new?lang=${lang}`} className="modern-button-primary">
                {i18n.header.new}
              </Link>
              <Link href={`/settings?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                {i18n.header.settings}
              </Link>
              <Link href={`/dashboard?lang=${lang}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                {i18n.header.dashboard}
              </Link>
              {user.role === 'ADMIN' && (
                <Link href={`/admin/products?lang=${lang}`} className="text-purple-600 hover:text-purple-800 transition-colors">
                  {i18n.header.admin}
                </Link>
              )}
              <button onClick={logout} className="text-gray-500 hover:text-gray-700 transition-colors">
                {i18n.header.logout}
              </button>
            </>
          ) : (
            <>
              <Link href={`/login?next=%2Fproducts%2Fnew&lang=${lang}`} className="modern-button-primary">
                {i18n.header.new}
              </Link>
              <Link href={`/login?lang=${lang}`} className="modern-button-secondary">
                {i18n.header.login}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


