import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { t } from '@/lib/i18n'

export default async function Home({ searchParams }: { searchParams: { lang?: string } }) {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/products/${p.id}?lang=${lang}`} className="border p-4 hover:bg-gray-50">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">{i18n.priceUSD(p.priceCents)}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
