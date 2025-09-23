"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceCents, setPriceCents] = useState<number>(0)
  const [currencyCode, setCurrencyCode] = useState('840')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [dropboxPath, setDropboxPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priceCents, currencyCode, youtubeUrl, dropboxPath })
      })
      if (!res.ok) throw new Error('Failed to create product')
      const product = await res.json()
      router.push(`/products/${product.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">New Product</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <input type="number" className="w-1/2 border p-2" placeholder="Price (cents)" value={priceCents} onChange={e => setPriceCents(Number(e.target.value))} required />
          <input className="w-1/2 border p-2" placeholder="Currency code (numeric, e.g. 840)" value={currencyCode} onChange={e => setCurrencyCode(e.target.value)} />
        </div>
        <input className="w-full border p-2" placeholder="YouTube URL" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} required />
        <input className="w-full border p-2" placeholder="Dropbox file path (e.g. /videos/foo.mp4)" value={dropboxPath} onChange={e => setDropboxPath(e.target.value)} required />
        {error && <p className="text-red-600">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2" disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
      </form>
    </div>
  )
}


