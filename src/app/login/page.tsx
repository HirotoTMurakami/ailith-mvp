"use client"
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthInner() {
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dropbox, setDropbox] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
        if (!res.ok) throw new Error('Login failed')
      } else {
        const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, dropboxAccessToken: dropbox }) })
        if (!res.ok) throw new Error('Sign up failed')
        // optional: auto-login after signup
        const loginRes = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
        if (!loginRes.ok) throw new Error('Auto login failed')
      }
      const next = search.get('next') || '/'
      router.push(next)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
    }
  }
  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
        <button className="text-sm underline" onClick={() => setMode(mode==='login'?'signup':'login')}>
          {mode === 'login' ? 'Create account' : 'Have an account? Login'}
        </button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="w-full border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {mode === 'signup' && (
          <input className="w-full border p-2" placeholder="Dropbox Access Token (optional)" value={dropbox} onChange={e => setDropbox(e.target.value)} />
        )}
        {error && <div className="text-red-600">{error}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 w-full">{mode==='login'?'Login':'Sign Up'}</button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto p-6" />}> 
      <AuthInner />
    </Suspense>
  )
}


