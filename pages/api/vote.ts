import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.firestore()

export default async function vote(req: any, res: any) {
  const rating = req.body
  await db.collection('ratings').add({
    rating,
    createdAt: new Date().toISOString(),
  })

  res.status(200).json({ isPhoneNumberInDB: true })

  return
}
