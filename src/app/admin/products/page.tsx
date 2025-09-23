"use client"
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = async (url: string) => {
  const r = await fetch(url)
  if (!r.ok) {
    const msg = await r.text().catch(() => '')
    throw new Error(msg || `Request failed: ${r.status}`)
  }
  return r.json()
}

type PendingProduct = {
  id: string
  title: string
  description: string
  priceCents: number
  currencyCode: string
  youtubeUrl: string
  dropboxPath: string
  downloadPassword?: string | null
  seller: { id: string; username: string; dropboxAccessToken: string | null } | null
  tempLinkEndpoint?: string
}

export default function AdminProductsPage() {
  const { data: pending, error: errP, mutate: mutP } = useSWR<PendingProduct[]>('/api/admin/products/pending', fetcher)
  const { data: approved, error: errA, mutate: mutA } = useSWR<PendingProduct[]>('/api/admin/products/approved', fetcher)
  const [noteUrl, setNoteUrl] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const approve = async () => {
    if (!selected || !noteUrl) return
    const res = await fetch('/api/admin/products/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: selected, noteUrl }) })
    if (res.ok) { setSelected(null); setNoteUrl(''); mutP(); mutA() }
  }

  const deny = async (id: string) => {
    await fetch('/api/admin/products/deny', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id }) })
    setSelected(s => (s === id ? null : s))
    mutP(); mutA()
  }

  const save = async (p: PendingProduct) => {
    const priceYen = Math.round(p.priceCents/100)
    await fetch('/api/admin/products/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, title: p.title, description: p.description, priceYen, youtubeUrl: p.youtubeUrl, dropboxPath: p.dropboxPath, noteUrl: (p as any).noteUrl ?? null }) })
    mutP(); mutA()
  }

  const remove = async (id: string) => {
    await fetch('/api/admin/products/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setSelected(s => (s === id ? null : s))
    mutP(); mutA()
  }

  const recordSale = async (id: string, yen: number) => {
    await fetch('/api/admin/orders/record', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id, amountYen: yen }) })
    mutP(); mutA()
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pending Products</h1>
      {errP && (
        <div className="text-red-600">Access denied or error. Please login as ADMIN.</div>
      )}
      <div className="grid gap-2">
        {Array.isArray(pending) && pending.map((p) => (
          <div key={p.id} className={`border p-3 ${selected===p.id ? 'bg-gray-50' : ''}`}>
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{p.description}</div>
            <div className="text-sm text-gray-600">YouTube: <input className="border px-1 py-0.5 w-full" value={p.youtubeUrl} onChange={e => { p.youtubeUrl = e.target.value; }} /></div>
            <div className="text-sm text-gray-600">Dropbox Path: <input className="border px-1 py-0.5 w-full font-mono" value={p.dropboxPath} onChange={e => { p.dropboxPath = e.target.value; }} /></div>
            <div className="text-sm text-gray-600">Price: <input type="number" className="border px-1 py-0.5 w-24" defaultValue={Math.round(p.priceCents/100)} onChange={e => { const v = Number(e.target.value)||0; p.priceCents = v*100; }} /> (JPY)</div>
            <div className="text-sm text-gray-600">Title: <input className="border px-1 py-0.5 w-full" value={p.title} onChange={e => { p.title = e.target.value; }} /></div>
            <div className="text-sm text-gray-600">Description:<textarea className="border px-1 py-0.5 w-full" value={p.description} onChange={e => { p.description = e.target.value; }} />
            </div>
            <div className="text-sm text-gray-600">Seller: {p.seller?.username || '-'}</div>
            <div className="text-sm text-gray-600">Seller Dropbox Token: <span className="break-all font-mono">{p.seller?.dropboxAccessToken || '-'}</span></div>
            <div className="text-xs text-gray-500">Temp Link Endpoint: <span className="break-all font-mono">{p.tempLinkEndpoint}</span></div>
            <div className="text-sm text-gray-600">Password: <span className="font-mono">{p.downloadPassword || '-'}</span></div>
            <div className="mt-2 flex gap-3">
              <button className="text-blue-600 underline" onClick={() => setSelected(p.id)}>Select</button>
              <button className="text-red-600 underline" onClick={() => deny(p.id)}>Deny</button>
              <button className="text-emerald-700 underline" onClick={() => save(p)}>Save</button>
              <button className="text-indigo-700 underline" onClick={() => recordSale(p.id, Math.round(p.priceCents/100))}>Record Sale</button>
              <button className="text-gray-700 underline" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-6">Approved Products</h2>
      {errA && (
        <div className="text-red-600">Access denied or error. Please login as ADMIN.</div>
      )}
      <div className="grid gap-2">
        {Array.isArray(approved) && approved.map((p) => (
          <div key={p.id} className={`border p-3`}>
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">YouTube: <input className="border px-1 py-0.5 w-full" defaultValue={p.youtubeUrl} onBlur={e => { p.youtubeUrl = e.target.value; save(p) }} /></div>
            <div className="text-sm text-gray-600">Dropbox Path: <input className="border px-1 py-0.5 w-full font-mono" defaultValue={p.dropboxPath} onBlur={e => { p.dropboxPath = e.target.value; save(p) }} /></div>
            <div className="text-sm text-gray-600">Price: <input type="number" className="border px-1 py-0.5 w-24" defaultValue={Math.round(p.priceCents/100)} onBlur={e => { const v = Number(e.target.value)||0; p.priceCents = v*100; save(p) }} /> (JPY)</div>
            <div className="text-sm text-gray-600">note URL: <input className="border px-1 py-0.5 w-full" defaultValue={(p as any).noteUrl || ''} onBlur={e => { (p as any).noteUrl = e.target.value; save(p) }} /></div>
            <div className="text-sm text-gray-600">Title: <input className="border px-1 py-0.5 w-full" defaultValue={p.title} onBlur={e => { p.title = e.target.value; save(p) }} /></div>
            <div className="text-sm text-gray-600">Description:<textarea className="border px-1 py-0.5 w-full" defaultValue={p.description} onBlur={e => { p.description = e.target.value; save(p) }} />
            </div>
            <div className="mt-2 flex gap-3">
              <button className="text-gray-700 underline" onClick={() => remove(p.id)}>Delete</button>
              <button className="text-indigo-700 underline" onClick={() => recordSale(p.id, Math.round(p.priceCents/100))}>Record Sale</button>
            </div>
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


