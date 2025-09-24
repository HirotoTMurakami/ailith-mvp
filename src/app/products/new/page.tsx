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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{i18n.newProduct}</h1>
        <Link href={`?lang=${lang === 'ja' ? 'en' : 'ja'}`} className="text-sm underline">{i18n.langToggle}</Link>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2" placeholder={i18n.title} value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2" placeholder={i18n.description} value={description} onChange={e => setDescription(e.target.value)} />
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700">{i18n.price}</label>
          <span className="text-xs text-gray-500">{i18n.priceJPYWithUSD(Number(priceYen||0), usdRate)}</span>
        </div>
        <input type="number" className="w-full border p-2" placeholder={i18n.priceYenPlaceholder} value={priceYen} onChange={e => setPriceYen(Number(e.target.value))} required />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 w-40">{lang==='ja'?'商品タイプ':'Product Type'}</label>
          <select className="border p-2" value={productType} onChange={e=>setProductType(e.target.value as 'VIDEO'|'IMAGE')}>
            <option value="VIDEO">{lang==='ja'?'動画':'Video'}</option>
            <option value="IMAGE">{lang==='ja'?'画像':'Image'}</option>
          </select>
        </div>
        <input className="w-full border p-2" placeholder={i18n.youtubeUrl + ' (' + (lang==='ja'?'任意':'optional') + ')'} value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
        <textarea className="w-full border p-2" rows={3} placeholder={lang==='ja'?'サンプル画像URL（1行に1つ）':'Sample image URLs (one per line)'} value={sampleImages} onChange={e=>setSampleImages(e.target.value)} />
        <input className="w-full border p-2" placeholder={`${i18n.dropboxPath} (e.g. /videos/foo.mp4)`} value={dropboxPath} onChange={e => setDropboxPath(e.target.value)} required />
        <div className="text-xs text-gray-600 leading-5">
          {lang==='ja' ? (
            <div>
              <div className="font-medium mb-1">Dropbox パスの書き方</div>
              <ul className="list-disc ml-5 space-y-1">
                <li>先頭に<code className="bg-gray-100 px-1">/</code>を付けたフルパスを入力してください。</li>
                <li>拡張子まで含め、<span className="font-mono">大文字/小文字</span>は実ファイル名と一致させてください。</li>
                <li>共有リンク（https://...）ではなく、<strong>パス</strong>を入力します。</li>
                <li>例: <code className="bg-gray-100 px-1">/videos/sample.mp4</code>、<code className="bg-gray-100 px-1">/映画/2025/作品A.mov</code></li>
              </ul>
            </div>
          ) : (
            <div>
              <div className="font-medium mb-1">How to write a Dropbox path</div>
              <ul className="list-disc ml-5 space-y-1">
                <li>Enter the full path starting with <code className="bg-gray-100 px-1">/</code>.</li>
                <li>Include the file extension and match <span className="font-mono">case-sensitivity</span> exactly.</li>
                <li>Provide a <strong>path</strong>, not a shared link (no https://...).</li>
                <li>Examples: <code className="bg-gray-100 px-1">/videos/sample.mp4</code>, <code className="bg-gray-100 px-1">/Movies/2025/TitleA.mov</code></li>
              </ul>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600">
          {lang==='ja'
            ? '売上金の分配は収益の70%をPaypalを通して売上が発生した日から数営業日以内に行います。'
            : 'Payouts are made via PayPal: 70% of revenue within a few business days after the sale date.'}
        </p>
        {error && <p className="text-red-600">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2" disabled={loading}>{loading ? i18n.saving : i18n.create}</button>
      </form>
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


