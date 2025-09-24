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
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{product.title}</h1>
      {(videoId || sampleImages.length>0) && (
        <div>
          <div className="text-xs text-gray-600 mb-1">{i18n.samplePreview}</div>
          {videoId && (
            <div className="aspect-video border mb-2">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="Sample preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
          {sampleImages.length>0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sampleImages.map((src,idx)=> (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={idx} src={src} alt={`sample-${idx}`} className="w-full h-32 object-cover border" />
              ))}
            </div>
          )}
        </div>
      )}
      <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{i18n.priceJPYWithUSD(yen, usdRate)}</div>
        {product.noteUrl ? (
          <Link href={product.noteUrl} className="bg-emerald-600 text-white px-4 py-2">{i18n.buyWithNote}</Link>
        ) : (
          <Link href={`/checkout/${product.id}?lang=${lang}`} className="bg-rose-600 text-white px-4 py-2">{i18n.buy}</Link>
        )}
      </div>
      <div className="border p-4 space-y-2">
        <div className="text-sm text-gray-700">{i18n.enterPasswordNote}</div>
        <PasswordForm productId={product.id} />
      </div>
    </div>
  )
}


