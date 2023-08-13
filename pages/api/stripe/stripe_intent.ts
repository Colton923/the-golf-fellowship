import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const handler = async (req: any, res: any) => {
  const body = req.body
  if (body.payment_intent_id) {
    try {
      // If a payment_intent_id is passed, retrieve the paymentIntent
      const current_intent = await stripe.paymentIntents.retrieve(
        body.payment_intent_id
      )
      // If a paymentIntent is retrieved update its amount
      if (current_intent) {
        // Update the paymentIntent to include the line items
        const updated_intent = await stripe.paymentIntents.update(
          body.payment_intent_id,
          {
            amount: body.amount,
          }
        )
        res.status(200).json(updated_intent)
        return
      }
    } catch (e) {
      console.log(e)
      //Catch any error and return a status 500
      //@ts-ignore
      if (e.code !== 'resource_missing') {
        const errorMessage = e instanceof Error ? e.message : 'Internal server error'
        res.status(500).json({ statusCode: 500, message: errorMessage })
        return
      }
    }
  } else {
    try {
      // Create PaymentIntent
      const params: any = {
        amount: body.amount,
        currency: 'usd',
        description: 'Payment description',
        automatic_payment_methods: {
          enabled: true,
        },
      }
      if (body.customer) {
        params.customer = body.customer
      }
      const payment_intent = await stripe.paymentIntents.create(params)
      //Return the payment_intent object
      res.status(200).json(payment_intent)
    } catch (err) {
      console.log(err)
      const errorMessage =
        err instanceof Error ? err.message : 'Internal server error'
      res.status(500).json({ statusCode: 500, message: errorMessage })
    }
  }
}
export default handler
