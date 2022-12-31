import * as admin from 'firebase-admin'
import { collection, doc, setDoc, addDoc } from 'firebase/firestore'

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

  const userDoc = db.doc(`users/${uid}`)
  console.log('adding')
  await db.runTransaction(async (t) => {
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
      },
      {
        merge: true,
      }
    )
  })

  console.log('added')
  res.status(200).json({ success: true })
}
