import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export type invoiceWithLineItems = {
  customer: string
  default_source: string
  lineItems: {
    price: string
    quantity: number
  }[]
}

const handler = async (req: any, res: any) => {
  const body: invoiceWithLineItems = req.body

  try {
    const invoice = await stripe.invoices.create({
      customer: body.customer,
      collection_method: 'charge_automatically',
      default_source: body.default_source,
      // lines: {
      //   body.lineItems.map((item: any) => {
      //     return {
      //       price: item.price,
      //       quantity: item.quantity,
      //     }})
      // },
    })

    res.status(200).json(invoice)
    return
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
