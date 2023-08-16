import { NewPurchase, newPurchaseResponse } from '@components/context/Context'
import { NextApiRequest, NextApiResponse } from 'next'
import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.firestore()

export default async function newPurchase(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: NewPurchase = req.body.data
  if (data.cart.length === 0) {
    res.status(400).json({ error: 'Cart is empty' })
    return
  }
  if (data.cart.length > 0) {
    if (data.total <= 0) {
      res.status(400).json({ error: 'Total is invalid' })
      return
    }
    if (
      data.uid === '' ||
      data.uid === undefined ||
      data.uid === null ||
      data.uid.length <= 1
    ) {
      res.status(400).json({ error: 'User is invalid' })
      return
    }
    await db
      .collection('users')
      .doc(data.uid)
      .collection('purchases')
      .add({
        cart: data.cart,
        total: data.total,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        const response: newPurchaseResponse = {
          success: true,
          message: 'Purchase recorded to user account',
        }
        res.status(200).json(response)
        return
      })
      .catch((error) => {
        console.log(error)
        //todo send email to admin
        const response: newPurchaseResponse = {
          success: false,
          message:
            'Error recording purchase to user account. Report sent to administrator.',
        }
        res.status(500).json(response)
        return
      })
  } else {
    const response: newPurchaseResponse = {
      success: false,
      message:
        'Error recording purchase to user account. Report sent to administrator.',
    }
    res.status(500).json(response)
    return
  }
}
