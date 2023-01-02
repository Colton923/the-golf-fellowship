import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const handler = async (req: any, res: any) => {
  try {
    const productId = req.body.productId
    await stripe.prices
      .list({
        product: productId,
      })
      .then((prices) => {
        return prices.data[0]
      })
      .then((price) => {
        res.status(200).json({
          statusCode: 200,
          price: price.id,
        })

        return
      })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Internal server error'
    res.status(500).json({
      statusCode: 500,
      message: errorMessage,
    })

    return
  }
}

export default handler
