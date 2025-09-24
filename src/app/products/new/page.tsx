"use client"
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { t, getLangFromSearch } from '@/lib/i18n'

function NewProductFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = getLangFromSearch(searchParams)
  const i18n = t(lang)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceYen, setPriceYen] = useState<number>(0)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [productType, setProductType] = useState<'VIDEO'|'IMAGE'>('VIDEO')
  const [sampleImages, setSampleImages] = useState<string>('')
  const [dropboxPath, setDropboxPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const usdRate = 0.0065

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priceYen, youtubeUrl, dropboxPath, productType, sampleImageUrls: sampleImages.split('\n').map(s=>s.trim()).filter(Boolean) })
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{i18n.newProduct}</h1>
              <p className="text-gray-600 mt-1">{lang==='ja'?'新しいコンテンツを投稿しましょう':'Share your amazing content with the world'}</p>
            </div>
            <Link href={`?lang=${lang === 'ja' ? 'en' : 'ja'}`} className="modern-button-secondary text-sm">
              {i18n.langToggle}
            </Link>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{i18n.title}</label>
              <input className="modern-input" placeholder={i18n.title} value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{i18n.description}</label>
              <textarea rows={4} className="modern-input" placeholder={i18n.description} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{lang==='ja'?'商品タイプ':'Product Type'}</label>
                <select className="modern-input" value={productType} onChange={e=>setProductType(e.target.value as 'VIDEO'|'IMAGE')}>
                  <option value="VIDEO">🎬 {lang==='ja'?'動画':'Video'}</option>
                  <option value="IMAGE">🖼️ {lang==='ja'?'画像':'Image'}</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">{i18n.price}</label>
                  <span className="text-xs text-blue-600 font-medium">{i18n.priceJPYWithUSD(Number(priceYen||0), usdRate)}</span>
                </div>
                <input type="number" className="modern-input" placeholder={i18n.priceYenPlaceholder} value={priceYen} onChange={e => setPriceYen(Number(e.target.value))} required />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.youtubeUrl} <span className="text-gray-500">({lang==='ja'?'任意':'optional'})</span>
              </label>
              <input className="modern-input" placeholder={i18n.youtubeUrl} value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang==='ja'?'サンプル画像URL':'Sample Image URLs'}
              </label>
              <textarea rows={3} className="modern-input" placeholder={lang==='ja'?'サンプル画像URL（1行に1つ）':'Sample image URLs (one per line)'} value={sampleImages} onChange={e=>setSampleImages(e.target.value)} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{i18n.dropboxPath}</label>
              <input className="modern-input" placeholder="/videos/example.mp4" value={dropboxPath} onChange={e => setDropboxPath(e.target.value)} required />
              <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-800 leading-relaxed">
                  {lang==='ja' ? (
                    <div>
                      <div className="font-medium mb-2">📁 Dropbox パスの書き方</div>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>先頭に<code className="bg-white px-1 rounded">/</code>を付けたフルパスを入力</li>
                        <li>拡張子まで含め、大文字/小文字を正確に</li>
                        <li>共有リンクではなく、パスを入力</li>
                        <li>例: <code className="bg-white px-1 rounded">/videos/sample.mp4</code></li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium mb-2">📁 How to write a Dropbox path</div>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Start with <code className="bg-white px-1 rounded">/</code></li>
                        <li>Include extension and match case exactly</li>
                        <li>Use path, not a shared link</li>
                        <li>Example: <code className="bg-white px-1 rounded">/videos/sample.mp4</code></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-sm text-green-800">
                💰 {lang==='ja'
                  ? '売上金の分配は収益の70%をPaypalを通して売上が発生した日から数営業日以内に行います。'
                  : 'Payouts: 70% of revenue via PayPal within a few business days after sale.'}
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            
            <button className={`w-full ${loading ? 'modern-button-secondary' : 'modern-button-primary'} text-lg py-4`} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {i18n.saving}
                </span>
              ) : (
                i18n.create
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-6" />}> 
      <NewProductFormInner />
    </Suspense>
  )
}


