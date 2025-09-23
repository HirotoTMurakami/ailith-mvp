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
    <header className="border-b bg-[var(--card)]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/?lang=${lang}`} className="font-semibold flex items-center gap-2 text-[var(--foreground)]">
          <span className="inline-block w-7 h-7 rounded-md bg-[var(--foreground)] text-[var(--card)] text-xs flex items-center justify-center">A</span>
          {i18n.header.brand}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-[var(--foreground)]">
          {user ? (
            <>
              <Link href={`/products/new?lang=${lang}`}>{i18n.header.new}</Link>
              <Link href={`/settings?lang=${lang}`}>{i18n.header.settings}</Link>
              <Link href={`/dashboard?lang=${lang}`}>{i18n.header.dashboard}</Link>
              <button onClick={logout} className="text-[var(--muted)] hover:text-[var(--foreground)]">{i18n.header.logout}</button>
            </>
          ) : (
            <>
              <Link href={`/login?next=%2Fproducts%2Fnew&lang=${lang}`}>{i18n.header.new}</Link>
              <Link href={`/login?lang=${lang}`}>{i18n.header.login}</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


