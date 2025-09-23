"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { t, getLangFromSearch } from '@/lib/i18n'

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = getLangFromSearch(searchParams)
  const i18n = t(lang)
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
      router.push(`/products/${product.id}?lang=${lang}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{i18n.newProduct}</h1>
        <Link href={`?lang=${lang === 'ja' ? 'en' : 'ja'}`} className="text-sm underline">{i18n.langToggle}</Link>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2" placeholder={i18n.title} value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2" placeholder={i18n.description} value={description} onChange={e => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <input type="number" className="w-1/2 border p-2" placeholder={i18n.priceCentsPlaceholder} value={priceCents} onChange={e => setPriceCents(Number(e.target.value))} required />
          <input className="w-1/2 border p-2" placeholder={`${i18n.currencyCode} (e.g. 840)`} value={currencyCode} onChange={e => setCurrencyCode(e.target.value)} />
        </div>
        <input className="w-full border p-2" placeholder={i18n.youtubeUrl} value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} required />
        <input className="w-full border p-2" placeholder={`${i18n.dropboxPath} (e.g. /videos/foo.mp4)`} value={dropboxPath} onChange={e => setDropboxPath(e.target.value)} required />
        {error && <p className="text-red-600">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2" disabled={loading}>{loading ? i18n.saving : i18n.create}</button>
      </form>
    </div>
  )
}


