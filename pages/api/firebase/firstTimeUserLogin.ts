import * as admin from 'firebase-admin'
import Stripe from 'stripe'

//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.firestore()

export default async function firstTimeUserLogin(req: any, res: any) {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const phone = req.body.phone
  const uid = req.body.uid
  const address = req.body.address
  const membership = req.body.membership
  const stripeSubId = req.body.stripeSubId
  console.log('stripeSubId', stripeSubId)

  const newTimeNow = new Date().getTime()

  const userDoc = db.doc(`users/${uid}`)

  await db.runTransaction(async (t) => {
    try {
      t.set(
        userDoc,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          uid: uid,
          address: address,
          membership: membership,
          dateAdded: newTimeNow,
        },
        {
          merge: true,
        }
      )

      // t.set(db.doc(`users/${uid}/checkout_sessions/${paymentIntent}`), {
      //   paymentIntentObject: paymentIntentObject,
      // })

      return
    } catch (e) {
      console.log('error', e)
      res.status(500).json({ success: false, error: e })

      return
    }
  })

  res.status(200).json({ success: true })
}
