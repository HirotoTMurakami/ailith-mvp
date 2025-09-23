import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'


async function createOrderAndRedirect(productId: string) {
	const product = await prisma.product.findUnique({ where: { id: productId } })
	if (!product) return redirect('/')
	const order = await prisma.order.create({
		data: {
			productId: product.id,
			amountCents: product.priceCents,
			currencyCode: product.currencyCode,
			status: 'PENDING'
		}
	})
	// Hand off to API to construct CCBill URL and redirect
	redirect(`/api/ccbill/checkout?orderId=${order.id}`)
}

export default async function CheckoutPage({ params }: { params: { id: string } }) {
	await createOrderAndRedirect(params.id)
	return null
}
