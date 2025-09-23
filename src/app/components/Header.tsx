"use client"
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function Header() {
  const { data } = useSWR('/api/auth/me', fetcher)
  const user = data?.user as { username: string; role?: string } | undefined
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">AI Video Marketplace</Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <Link href="/products/new">New</Link>
          ) : (
            <Link href="/login?next=%2Fproducts%2Fnew">New</Link>
          )}
          {user ? (
            <>
              <Link href="/settings">Settings</Link>
              {user.role === 'ADMIN' && <Link href="/admin/products">Admin</Link>}
              <Link href="/messages">Messages</Link>
              <button onClick={logout} className="text-gray-600">Logout</button>
            </>
          ) : (
            <Link href="/login">Login / Sign Up</Link>
          )}
        </nav>
      </div>
    </header>
  )
}


