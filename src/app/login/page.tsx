"use client"
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getLangFromSearch } from '@/lib/i18n'

function AuthInner() {
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dropbox, setDropbox] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()
  const lang = getLangFromSearch(search)
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
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              A
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              {mode === 'login' ? (lang==='ja'?'ログイン':'Login') : (lang==='ja'?'新規登録':'Sign Up')}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'login' 
                ? (lang==='ja'?'アカウントにログインしてください':'Welcome back! Please sign in')
                : (lang==='ja'?'アカウントを作成してコンテンツを共有しましょう':'Create an account to share your content')
              }
            </p>
          </div>
          
          <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
            <button 
              className={`flex-1 py-2 px-4 text-center font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`} 
              onClick={() => setMode('login')}
            >
              {lang==='ja'?'ログイン':'Login'}
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-center font-medium rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`} 
              onClick={() => setMode('signup')}
            >
              {lang==='ja'?'新規登録':'Sign Up'}
            </button>
          </div>
          
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang==='ja'?'ユーザー名':'Username'}
              </label>
              <input className="modern-input" placeholder={lang==='ja'?'ユーザー名':'Username'} value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang==='ja'?'パスワード':'Password'}
              </label>
              <input type="password" className="modern-input" placeholder={lang==='ja'?'パスワード':'Password'} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang==='ja'?'Dropboxアクセストークン':'Dropbox Access Token'} 
                  <span className="text-gray-500"> ({lang==='ja'?'任意':'optional'})</span>
                </label>
                <input className="modern-input" placeholder={lang==='ja'?'Dropboxアクセストークン（任意）':'Dropbox Access Token (optional)'} value={dropbox} onChange={e => setDropbox(e.target.value)} />
                <p className="text-xs text-gray-500 mt-1">
                  {lang==='ja'?'後でSettings画面から設定できます':'You can set this later in Settings'}
                </p>
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            
            <button className="w-full modern-button-primary text-lg py-3">
              {mode==='login'?(lang==='ja'?'ログイン':'Login'):(lang==='ja'?'新規登録':'Sign Up')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href={`/?lang=${lang}`} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← {lang==='ja'?'ホームに戻る':'Back to Home'}
            </a>
          </div>
        </div>
      </div>
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


