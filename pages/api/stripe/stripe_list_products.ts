import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const handler = async (req: any, res: any) => {

  if (req.method === 'GET') {
    try {
      const current_sub = await stripe.products.list({
        limit: 100,
      })

      if (current_sub) {
        res.status(200).json(current_sub)
        return
      }
    } catch (e) {
      //@ts-ignore
      if (e.code !== 'resource_missing') {
        const errorMessage =
          e instanceof Error ? e.message : 'Internal server error'
        res
          .status(500)
          .json({ statusCode: 500, message: errorMessage })
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
