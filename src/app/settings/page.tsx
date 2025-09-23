"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [dropboxAccessToken, setToken] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const res = await fetch('/api/users/me/dropbox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dropboxAccessToken }) })
    if (!res.ok) { setMsg('Failed'); return }
    setMsg('Saved')
    router.refresh()
  }
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2" placeholder="Dropbox Access Token" value={dropboxAccessToken} onChange={e => setToken(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2">Save</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  )
}


