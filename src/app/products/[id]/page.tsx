import { prisma } from '@/lib/prisma'
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
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  const i18n = t(lang)
  // Extract YouTube embed id
  const match = product.youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]+)/)
  const videoId = match?.[1]

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{product.title}</h1>
      {videoId && (
        <div>
          <div className="text-xs text-gray-600 mb-1">Sample preview</div>
          <div className="aspect-video border">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="Sample preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
      <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{i18n.priceUSD(product.priceCents)}</div>
        {product.noteUrl ? (
          <Link href={product.noteUrl} className="bg-emerald-600 text-white px-4 py-2">Buy with note</Link>
        ) : (
          <Link href={`/checkout/${product.id}?lang=${lang}`} className="bg-rose-600 text-white px-4 py-2">{i18n.buy}</Link>
        )}
      </div>
      <div className="border p-4 space-y-2">
        <div className="text-sm text-gray-700">Enter password purchased on note to download</div>
        <PasswordForm productId={product.id} />
      </div>
    </div>
  )
}


