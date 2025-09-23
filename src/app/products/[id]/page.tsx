import { prisma } from '@/lib/prisma'
import Link from 'next/link'


export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) {
    return <div className="p-6">Not found</div>
  }
  // Extract YouTube embed id
  const match = product.youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]+)/)
  const videoId = match?.[1]

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{product.title}</h1>
      {videoId && (
        <div className="aspect-video">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}
      <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">${(product.priceCents / 100).toFixed(2)} USD</div>
        <Link href={`/checkout/${product.id}`} className="bg-rose-600 text-white px-4 py-2">Buy with CCBill</Link>
      </div>
    </div>
  )
}


