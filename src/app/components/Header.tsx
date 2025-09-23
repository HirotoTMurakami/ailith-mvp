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
  const { data } = useSWR('/api/auth/me', fetcher)
  const user = data?.user as { username: string; role?: string } | undefined
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href={`/?lang=${lang}`} className="font-semibold flex items-center gap-2">
          <span className="inline-block w-6 h-6 rounded bg-black text-white text-xs flex items-center justify-center">A</span>
          {i18n.header.brand}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <Link href={`/products/new?lang=${lang}`}>{i18n.header.new}</Link>
          ) : (
            <Link href={`/login?next=%2Fproducts%2Fnew&lang=${lang}`}>{i18n.header.new}</Link>
          )}
          {user ? (
            <>
              <Link href={`/settings?lang=${lang}`}>{i18n.header.settings}</Link>
              <Link href={`/dashboard?lang=${lang}`}>{i18n.header.dashboard}</Link>
              {user.role === 'ADMIN' && <Link href={`/admin/products?lang=${lang}`}>{i18n.header.admin}</Link>}
              <Link href={`/messages?lang=${lang}`}>{i18n.header.messages}</Link>
              <button onClick={logout} className="text-gray-600">{i18n.header.logout}</button>
            </>
          ) : (
            <Link href={`/login?lang=${lang}`}>{i18n.header.login}</Link>
          )}
        </nav>
      </div>
    </header>
  )
}


