import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { t } from '@/lib/i18n'
import PasswordForm from './password-form'


export default async function ProductDetail({ params, searchParams }: { params: { id: string }, searchParams: { lang?: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) {
    return <div className="p-6">Not found</div>
  }
  if ((product as unknown as { approvalStatus?: string }).approvalStatus !== 'APPROVED') {
    return <div className="p-6">Not available</div>
  }
  const session = await getSession()
  let lang: 'ja' | 'en' = searchParams?.lang === 'ja' ? 'ja' : 'en'
  if (session.user) {
    const rows = await prisma.$queryRaw<Array<{ preferredLanguage: string | null }>>`
      SELECT "preferredLanguage" FROM "User" WHERE id = ${session.user.id}
    `
    const pref = rows[0]?.preferredLanguage
    if (pref === 'ja' || pref === 'en') lang = pref
  }
  const i18n = t(lang)
  // Extract YouTube embed id and sample images
  const yt = (product as unknown as { youtubeUrl?: string | null }).youtubeUrl || ''
  const match = yt.match(/(?:v=|youtu\.be\/)([\w-]+)/)
  const videoId = match?.[1]
  const sampleImages = (product as unknown as { sampleImageUrls?: string[] }).sampleImageUrls || []

  const yen = Math.round(product.priceCents / 100)
  const usdRate = 0.0065
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="glass-card p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${sampleImages.length > 0 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {sampleImages.length > 0 ? (lang==='ja'?'🖼️ 画像':'🖼️ Image') : (lang==='ja'?'🎬 動画':'🎬 Video')}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold gradient-text">{i18n.priceJPYWithUSD(yen, usdRate)}</div>
              {product.noteUrl ? (
                <Link href={product.noteUrl} className="modern-button-primary">
                  💳 {i18n.buyWithNote}
                </Link>
              ) : (
                <Link href={`/checkout/${product.id}?lang=${lang}`} className="modern-button-primary">
                  💳 {i18n.buy}
                </Link>
              )}
            </div>
          </div>
          
          {(videoId || sampleImages.length>0) && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${sampleImages.length > 0 ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                {i18n.samplePreview}
              </div>
              {videoId && (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-white mb-4">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="Sample preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              )}
              {sampleImages.length>0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleImages.map((src,idx)=> (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={idx} src={src} alt={`sample-${idx}`} className="w-full h-auto object-cover rounded-xl shadow-lg border-2 border-white" />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{lang==='ja'?'詳細説明':'Description'}</h3>
              <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl">
                {product.description}
              </div>
            </div>
          )}
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🔐 {lang==='ja'?'ダウンロード':'Download'}
          </h3>
          <div className="text-sm text-gray-600 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            {i18n.enterPasswordNote}
          </div>
          <PasswordForm productId={product.id} />
        </div>
      </div>
    </div>
  )
}


