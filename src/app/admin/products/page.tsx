"use client"
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type PendingProduct = { id: string; title: string; downloadPassword?: string | null }

export default function AdminProductsPage() {
  const { data, mutate } = useSWR<PendingProduct[]>('/api/admin/products/pending', fetcher)
  const [noteUrl, setNoteUrl] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const approve = async () => {
    if (!selected || !noteUrl) return
    const res = await fetch('/api/admin/products/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: selected, noteUrl }) })
    if (res.ok) { setSelected(null); setNoteUrl(''); mutate() }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pending Products</h1>
      <div className="grid gap-2">
        {data?.map((p) => (
          <div key={p.id} className={`border p-3 ${selected===p.id ? 'bg-gray-50' : ''}`}>
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">Password: <span className="font-mono">{p.downloadPassword || '-'}</span></div>
            <button className="mt-2 text-blue-600 underline" onClick={() => setSelected(p.id)}>Select</button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="border p-3 space-y-2">
          <input className="w-full border p-2" placeholder="note URL" value={noteUrl} onChange={e => setNoteUrl(e.target.value)} />
          <button className="bg-emerald-600 text-white px-4 py-2" onClick={approve}>Approve</button>
        </div>
      )}
    </div>
  )
}


