import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { t } from '@/lib/i18n'

export default async function Home({ searchParams }: { searchParams: { lang?: string } }) {
  const products = await prisma.product.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { createdAt: 'desc' } })
  const lang = searchParams?.lang === 'ja' ? 'ja' : 'en'
  const i18n = t(lang)
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{i18n.homeTitle}</h1>
        <div className="flex gap-2">
          <Link href={`/?lang=${lang === 'ja' ? 'en' : 'ja'}`} className="text-sm underline self-center">{i18n.langToggle}</Link>
          <Link href={`/products/new?lang=${lang}`} className="bg-blue-600 text-white px-4 py-2">{i18n.newProduct}</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => {
          const match = p.youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]+)/)
          const vid = match?.[1]
          const thumb = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : '/file.svg'
          return (
            <Link key={p.id} href={`/products/${p.id}?lang=${lang}`} className="border hover:shadow-sm rounded overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="text-sm text-gray-600">{i18n.priceUSD(p.priceCents)}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
