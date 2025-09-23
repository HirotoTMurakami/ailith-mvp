"use client"
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (u: string) => fetch(u).then(r => r.json())

type ProductLite = { id: string; title: string }
type UserLite = { id: string; username: string; role: string }
type Msg = { id: string; createdAt: string; senderId: string; body: string }

export default function MessagesPage() {
  const [productId, setProductId] = useState('')
  const [recipientId, setRecipientId] = useState('')
  const [body, setBody] = useState('')
  const { data, mutate } = useSWR<Msg[]>(productId ? `/api/messages?productId=${productId}` : null, fetcher)
  const { data: myProducts } = useSWR<ProductLite[]>('/api/products/mine', fetcher)
  const { data: allUsers } = useSWR<UserLite[]>('/api/users/all', fetcher)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || !recipientId || !body) return
    const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, recipientId, body }) })
    if (res.ok) { setBody(''); mutate() }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <div className="flex gap-2">
        <select className="border p-2 flex-1" value={productId} onChange={e => setProductId(e.target.value)}>
          <option value="">Select product</option>
          {(myProducts || []).map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <select className="border p-2 flex-1" value={recipientId} onChange={e => setRecipientId(e.target.value)}>
          <option value="">Select recipient</option>
          {(allUsers || []).map((u) => (
            <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
          ))}
        </select>
      </div>
      <div className="border p-3 h-64 overflow-auto bg-white">
        {(data || []).map((m) => (
          <div key={m.id} className="text-sm mb-2">
            <span className="font-mono text-gray-500">{new Date(m.createdAt).toLocaleString()} </span>
            <span className="font-semibold">{m.senderId}</span>: {m.body}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input className="border p-2 flex-1" placeholder="Type a message" value={body} onChange={e => setBody(e.target.value)} />
        <button className="bg-blue-600 text-white px-4">Send</button>
      </form>
    </div>
  )
}


