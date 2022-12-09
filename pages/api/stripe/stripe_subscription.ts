import Stripe from 'stripe'
import type { stripeProduct } from '../../../types/stripe/stripeProduct'
import { collection, addDoc } from 'firebase/firestore'
import * as admin from 'firebase-admin'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

type body = {
  sub: {
    name: string
    description: string
    unit_amount: number
    currency: string
    recurring: {
      aggregate_usage?: string
      interval: 'day' | 'week' | 'month' | 'year'
      interval_count?: number
      trial_period_days?: string
      usage_type?: string
    }
  }
  uid: string
}



const handler = async (req: any, res: any) => {
  const newProduct: body = req.body

  if (req.method === 'POST') {
    try {
      const current_sub = await stripe.products.create({
        name: newProduct.sub.name,
        description: newProduct.sub.description,
      })

      if (current_sub) {
        const updated_sub = await stripe.prices.create({
          product: current_sub.id,
          unit_amount: newProduct.sub.unit_amount,
          currency: newProduct.sub.currency,
          recurring: {
            interval: newProduct.sub.recurring.interval,
          },
        })
        res.status(200).json(updated_sub)

        // const db = admin.firestore()
        // const productRef = db.collection('products')
        // const newProductData: stripeProduct = {
        //   id: current_sub.id,
        //   object: 'product',
        //   active: true,
        //   created: Date.now(),
        //   default_price: updated_sub.unit_amount? updated_sub.unit_amount.toString() : '',
        //   description: current_sub.description? current_sub.description : '',
        //   livemode: false,
        //   name: current_sub.name? current_sub.name : '',
        // }
        // productRef.add(newProductData)

        return
      }
    } catch (e) {
      //@ts-ignore
      if (e.code !== 'resource_missing') {
        const errorMessage =
          e instanceof Error
            ? e.message
            : 'Internal server error'
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

  return res
}
export default handler
