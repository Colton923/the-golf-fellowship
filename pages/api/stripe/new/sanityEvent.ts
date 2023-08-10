import Stripe from 'stripe'
import type { Event } from '@api/sanity/getEvents'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
})

export interface SanityEventStripeProduct extends Event {
  stripeProductId?: string
  stripePriceId?: string
  totalPrice: number
}

const handler = async (req: any, res: any) => {
  const event: SanityEventStripeProduct = req.body.event

  // Check if a product with the same name already exists
  const existingProducts = await stripe.products.search({
    query: `metadata["eventId"]:"${event._id}"`,
    limit: 1,
  })

  let product

  if (existingProducts.data.length > 0) {
    // Use existing product
    product = existingProducts.data[0]
  } else {
    // Create new product
    product = await stripe.products.create({
      name: event.title,
      description: event.description[0],
      metadata: {
        eventType: 'event',
        eventId: event._id,
      },
    })
  }

  if (product) {
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: event.totalPrice * 100,
      currency: 'usd',
    })
    const newEvent: SanityEventStripeProduct = {
      ...event,
      stripeProductId: product.id,
      stripePriceId: price.id,
    }
    res.status(200).json(newEvent)
    return
  }
  res.status(500).json({
    statusCode: 500,
    message: 'POST method failed',
  })
  return
}

export default handler
