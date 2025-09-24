import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { t } from '@/lib/i18n'
import { getSession } from '@/lib/auth'

export default async function Home({ searchParams }: { searchParams: { lang?: string; q?: string; type?: string } }) {
  const q = (searchParams?.q || '').trim()
  const type = (searchParams?.type || '').toLowerCase()
  const all = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  const approved = all.filter(p => (p as unknown as { approvalStatus?: string }).approvalStatus === 'APPROVED')
  const byType = type === 'image' ? approved.filter(p => (p as unknown as { productType?: string }).productType === 'IMAGE')
    : type === 'video' ? approved.filter(p => (p as unknown as { productType?: string }).productType !== 'IMAGE')
    : approved
  const products = q ? byType.filter(p => (p.title + ' ' + (p as unknown as { description?: string }).description || '').toLowerCase().includes(q.toLowerCase())) : byType
  const session = await getSession()
  // Prefer URL lang over user preference
  let lang = searchParams?.lang === 'ja' ? 'ja' : searchParams?.lang === 'en' ? 'en' : 'en'
  if (!searchParams?.lang && session.user) {
    const rows = await prisma.$queryRaw<Array<{ preferredLanguage: string | null }>>`
      SELECT "preferredLanguage" FROM "User" WHERE id = ${session.user.id}
    `
    const pref = rows[0]?.preferredLanguage
    if (pref === 'ja' || pref === 'en') lang = pref
  }
  const i18n = t(lang as 'ja' | 'en')
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">{i18n.homeTitle}</h1>
              <p className="text-gray-600">{lang==='ja'?'AI生成コンテンツの革新的なマーケットプレイス':'Revolutionary marketplace for AI-generated content'}</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/?lang=${lang === 'ja' ? 'en' : 'ja'}`} className="modern-button-secondary text-sm">
                {i18n.langToggle}
              </Link>
              {session.user && (
                <Link href={`/products/new?lang=${lang}`} className="modern-button-primary">
                  {i18n.newProduct}
                </Link>
              )}
            </div>
          </div>
          
          <form className="mb-6" action="/" method="get">
            <input type="hidden" name="lang" value={lang} />
            <div className="flex flex-col sm:flex-row gap-3">
              <input name="q" defaultValue={q} className="modern-input flex-1 min-w-0" placeholder={lang==='ja'?'タイトル・説明で検索':'Search by title or description'} />
              <select name="type" defaultValue={type || ''} className="modern-input sm:w-32">
                <option value="">{lang==='ja'?'すべて':'All'}</option>
                <option value="video">{lang==='ja'?'動画':'Video'}</option>
                <option value="image">{lang==='ja'?'画像':'Image'}</option>
              </select>
              <button className="modern-button-primary sm:w-24 whitespace-nowrap">
                {lang==='ja'?'検索':'Search'}
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <Link className={`px-4 py-2 rounded-lg transition-all ${type===''?'bg-blue-100 text-blue-700':'text-gray-600 hover:text-gray-900'}`} href={`/?lang=${lang}${q?`&q=${encodeURIComponent(q)}`:''}`}>
              {lang==='ja'?'すべて':'All'}
            </Link>
            <Link className={`px-4 py-2 rounded-lg transition-all ${type==='video'?'bg-blue-100 text-blue-700':'text-gray-600 hover:text-gray-900'}`} href={`/?lang=${lang}&type=video${q?`&q=${encodeURIComponent(q)}`:''}`}>
              {lang==='ja'?'🎬 AI動画マーケット':'🎬 AI Video Marketplace'}
            </Link>
            <Link className={`px-4 py-2 rounded-lg transition-all ${type==='image'?'bg-blue-100 text-blue-700':'text-gray-600 hover:text-gray-900'}`} href={`/?lang=${lang}&type=image${q?`&q=${encodeURIComponent(q)}`:''}`}>
              {lang==='ja'?'🖼️ AI画像マーケット':'🖼️ AI Image Marketplace'}
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => {
            const yt = (p as unknown as { youtubeUrl?: string | null }).youtubeUrl || ''
            const match = yt.match(/(?:v=|youtu\.be\/)([\w-]+)/)
            const vid = match?.[1]
            const images = (p as unknown as { sampleImageUrls?: string[] }).sampleImageUrls || []
            const thumb = images[0] || (vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : '/file.svg')
            const yen = Math.round(p.priceCents / 100)
            const usdRate = 0.0065
            const productType = (p as unknown as { productType?: string }).productType || 'VIDEO'
            return (
              <Link key={p.id} href={`/products/${p.id}?lang=${lang}`} className="modern-card group hover:scale-105 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${productType === 'IMAGE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {productType === 'IMAGE' ? (lang==='ja'?'画像':'Image') : (lang==='ja'?'動画':'Video')}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{p.title}</h3>
                  <div className="text-lg font-bold gradient-text">{i18n.priceJPYWithUSD(yen, usdRate)}</div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {products.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {lang==='ja'?'商品が見つかりませんでした':'No products found'}
            </h3>
            <p className="text-gray-500">
              {lang==='ja'?'検索条件を変更してお試しください':'Try adjusting your search criteria'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
