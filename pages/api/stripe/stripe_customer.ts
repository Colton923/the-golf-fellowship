import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const handler = async (req: any, res: any) => {
  const body = req.body

  try {
    const isCustomer = await stripe.customers.list({
      email: body.email,
    })

    if (isCustomer.data.length > 0) {
      res.status(200).json(isCustomer.data[0])
      return
    } else {
      const customer = await stripe.customers.create({
        email: body.email,
        name: body.name,
        address: {
          line1: body.address.line1,
          line2: body.address.line2,
          city: body.address.city,
          state: body.address.state,
          postal_code: body.address.postal_code,
          country: body.address.country,
        },
      })
      res.status(200).json(customer)
      return
    }
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
