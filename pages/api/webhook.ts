import { buffer } from 'micro'
import initializeStripe from '../../stripe/initializeStripe'

//@ts-ignore
const stripe = initializeStripe()

const webhookSecret = process.env.STRIPE_WEBHOOK_KEY
export const config = {
  api: {
    bodyParser: false,
  },
}
//@ts-ignore
const handler = async (req, res) => {
  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    //@ts-ignore
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    //@ts-ignore
    res.status(400).send(`Webhook Error: ${err.message}`)
    //@ts-ignore
    console.log(`Webhook Error: ${err.message}`)
    return
  }
  //@ts-ignore
  const data = JSON.parse(buf)

  switch (event.type) {
    case 'payment_intent.created':
      const paymentIntent = event.data.object
      console.log(`PaymentIntent was created for: ${data.data.object.amount}`)
      break
    case 'payment_intent.succeeded,':
      const paymentMethod = event.data.object
      console.log(`PaymentIntent was successfull for: ${data.data.object.amount}`)
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
  res.json({ received: true })
}
export default handler
