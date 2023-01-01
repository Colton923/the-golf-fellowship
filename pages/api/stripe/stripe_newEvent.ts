import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const admin = process.env.NEXT_PUBLIC_ADMIN_COLTON_SECRET_UID

const handler = async (req: any, res: any) => {
  const newProduct = req.body

  if (req.method === 'POST' && newProduct.uid === admin) {
    try {
      const current_sub = await stripe.products.create({
        name: newProduct.name,
        description: newProduct.eventLocation,
      })

      if (current_sub) {
        const updated_sub = await stripe.prices.create({
          product: current_sub.id,
          unit_amount: newProduct.amount,
          currency: 'usd',
        })
        res.status(200).json(updated_sub)
        return
      }
    } catch (e) {
      //@ts-ignore
      if (e.code !== 'resource_missing') {
        const errorMessage = e instanceof Error ? e.message : 'Internal server error'
        res.status(500).json({ statusCode: 500, message: errorMessage })
        return
      }
    }
  } else {
    res.status(500).json({
      statusCode: 500,
      message: 'POST method failed',
    })
    return
  }
}
export default handler
