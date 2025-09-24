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
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{i18n.homeTitle}</h1>
        <div className="flex gap-2">
          <Link href={`/?lang=${lang === 'ja' ? 'en' : 'ja'}`} className="text-sm underline self-center">{i18n.langToggle}</Link>
          {session.user && (
            <Link href={`/products/new?lang=${lang}`} className="bg-blue-600 text-white px-4 py-2">{i18n.newProduct}</Link>
          )}
        </div>
      </div>
      <form className="mb-4 flex gap-2" action="/" method="get">
        <input type="hidden" name="lang" value={lang} />
        <input name="q" defaultValue={q} className="flex-1 border px-3 py-2" placeholder={lang==='ja'?'タイトル・説明で検索':'Search by title or description'} />
        <select name="type" defaultValue={type || ''} className="border px-2 py-2">
          <option value="">{lang==='ja'?'すべて':'All'}</option>
          <option value="video">{lang==='ja'?'動画':'Video'}</option>
          <option value="image">{lang==='ja'?'画像':'Image'}</option>
        </select>
        <button className="px-4 py-2 border">{lang==='ja'?'検索':'Search'}</button>
      </form>
      <div className="mb-3 flex gap-3 text-sm">
        <Link className={`underline ${type===''?'font-semibold':''}`} href={`/?lang=${lang}${q?`&q=${encodeURIComponent(q)}`:''}`}>{lang==='ja'?'すべて':'All'}</Link>
        <Link className={`underline ${type==='video'?'font-semibold':''}`} href={`/?lang=${lang}&type=video${q?`&q=${encodeURIComponent(q)}`:''}`}>{lang==='ja'?'AI動画マーケット':'AI Video Marketplace'}</Link>
        <Link className={`underline ${type==='image'?'font-semibold':''}`} href={`/?lang=${lang}&type=image${q?`&q=${encodeURIComponent(q)}`:''}`}>{lang==='ja'?'AI画像マーケット':'AI Image Marketplace'}</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => {
          const yt = (p as unknown as { youtubeUrl?: string | null }).youtubeUrl || ''
          const match = yt.match(/(?:v=|youtu\.be\/)([\w-]+)/)
          const vid = match?.[1]
          const images = (p as unknown as { sampleImageUrls?: string[] }).sampleImageUrls || []
          const thumb = images[0] || (vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : '/file.svg')
          const yen = Math.round(p.priceCents / 100)
          const usdRate = 0.0065
          return (
            <Link key={p.id} href={`/products/${p.id}?lang=${lang}`} className="border hover:shadow-sm rounded overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="text-sm text-gray-600">{i18n.priceJPYWithUSD(yen, usdRate)}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
