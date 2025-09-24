"use client"
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SettingsInner() {
  const [dropboxAccessToken, setToken] = useState('')
  const [paypalEmail, setPaypal] = useState('')
  const [preferredLanguage, setLang] = useState<'ja'|'en'>('en')
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()
  const lang = search.get('lang') === 'ja' ? 'ja' : 'en'
  useEffect(() => {
    ;(async () => {
      const r = await fetch('/api/users/me/profile')
      if (!r.ok) return
      const j = await r.json()
      setToken(j.profile?.dropboxAccessToken || '')
      setPaypal(j.profile?.paypalEmail || '')
      if (j.profile?.preferredLanguage === 'ja' || j.profile?.preferredLanguage === 'en') setLang(j.profile.preferredLanguage)
    })()
  }, [])
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const res1 = await fetch('/api/users/me/dropbox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dropboxAccessToken }) })
    if (!res1.ok) { setMsg('Failed'); return }
    const res2 = await fetch('/api/users/me/paypal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paypalEmail }) })
    if (!res2.ok) { setMsg('Failed'); return }
    const res3 = await fetch('/api/users/me/language', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ preferredLanguage }) })
    if (!res3.ok) { setMsg('Failed'); return }
    setMsg('Saved')
    router.refresh()
  }
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="glass-card p-8 mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-2">{lang==='ja'?'設定':'Settings'}</h1>
            <p className="text-gray-600">{lang==='ja'?'アカウント設定を管理します':'Manage your account settings'}</p>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang==='ja'?'Dropboxアクセス・トークン':'Dropbox Access Token'}
              </label>
              <input 
                className="modern-input" 
                placeholder={lang==='ja'?'Dropboxアクセス・トークン':'Dropbox Access Token'} 
                value={dropboxAccessToken} 
                onChange={e => setToken(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang==='ja'?'PayPalメールアドレス':'PayPal Email'}
              </label>
              <input 
                className="modern-input" 
                type="email"
                placeholder={lang==='ja'?'PayPalメールアドレス':'PayPal Email'} 
                value={paypalEmail} 
                onChange={e => setPaypal(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang==='ja'?'言語設定':'Language Preference'}
              </label>
              <select 
                className="modern-input" 
                value={preferredLanguage} 
                onChange={e => setLang((e.target.value as 'ja'|'en'))}
              >
                <option value="en">🇺🇸 English</option>
                <option value="ja">🇯🇵 日本語</option>
              </select>
            </div>
            
            {msg && (
              <div className={`p-4 rounded-xl border ${msg === 'Saved' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {msg === 'Saved' ? (lang==='ja'?'✓ 保存されました':'✓ Settings saved') : msg}
              </div>
            )}
            
            <button className="w-full modern-button-primary text-lg py-3">
              💾 {lang==='ja'?'保存':'Save Settings'}
            </button>
          </form>
        </div>
        
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📚 {lang==='ja'?'Dropbox Access Token の発行方法':'How to generate a Dropbox Access Token'}
          </h2>
          <div className="text-sm leading-6 text-gray-700">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-4">
              <div className="text-blue-800 font-medium">
                {lang==='ja'?'⚠️ 重要: トークンは第三者と共有しないでください':'⚠️ Important: Never share your token with others'}
              </div>
            </div>
        {lang==='ja' ? (
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              <a className="underline text-blue-700" href="https://www.dropbox.com/developers/apps" target="_blank" rel="noreferrer">Dropbox Developers Apps</a> にアクセスし、
              「Create app」をクリックします。
            </li>
            <li>
              App type は「Scoped access」を選択し、アクセス権は「Full Dropbox」または必要に応じて「App folder」を選びます。
            </li>
            <li>
              作成したアプリの「Permissions」タブで少なくとも次のスコープにチェックを入れます:
              <div className="ml-5">
                <code className="bg-gray-100 px-1">files.content.read</code>, <code className="bg-gray-100 px-1">files.metadata.read</code>
              </div>
            </li>
            <li>
              「Settings」タブで「Generated access token」または「OAuth 2」からアクセストークンを生成します（短期/長期の仕様はDropbox側の提供に従います）。
            </li>
            <li>
              生成されたトークンを上記入力欄に貼り付けて「保存」してください。トークンは第三者と共有しないでください。
            </li>
            <li>
              登録後は商品投稿フォームの「Dropbox ファイルパス」に、例 <code className="bg-gray-100 px-1">/videos/sample.mp4</code> のように対象ファイルのパスを指定します。
            </li>
          </ol>
        ) : (
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              Open <a className="underline text-blue-700" href="https://www.dropbox.com/developers/apps" target="_blank" rel="noreferrer">Dropbox Developers Apps</a> and click &quot;Create app&quot;.
            </li>
            <li>
              Choose &quot;Scoped access&quot; and select either &quot;Full Dropbox&quot; or &quot;App folder&quot; depending on your need.
            </li>
            <li>
              In the app &quot;Permissions&quot; tab enable at least:
              <div className="ml-5">
                <code className="bg-gray-100 px-1">files.content.read</code>, <code className="bg-gray-100 px-1">files.metadata.read</code>
              </div>
            </li>
            <li>
              In the &quot;Settings&quot; tab generate an access token (via Generated token or OAuth 2 as provided by Dropbox).
            </li>
            <li>
              Paste the generated token into the field above and click Save. Do not share your token.
            </li>
            <li>
              After saving, use the product form &quot;Dropbox file path&quot; like <code className="bg-gray-100 px-1">/videos/sample.mp4</code>.
            </li>
          </ol>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto p-6" />}> 
      <SettingsInner />
    </Suspense>
  )
}


