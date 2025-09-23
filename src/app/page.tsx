import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">AI Video Marketplace</h1>
        <Link href="/products/new" className="bg-blue-600 text-white px-4 py-2">New Product</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/products/${p.id}`} className="border p-4 hover:bg-gray-50">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">${(p.priceCents/100).toFixed(2)} USD</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
