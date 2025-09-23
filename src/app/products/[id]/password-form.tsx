"use client"
import { useState } from 'react'

export default function PasswordForm({ productId }: { productId: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, password }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      window.location.href = json.url
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input className="flex-1 border p-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-3" disabled={loading}>{loading ? '...' : 'Download'}</button>
      {error && <div className="text-red-600 text-sm ml-2 self-center">{error}</div>}
    </form>
  )
}


