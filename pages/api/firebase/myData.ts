import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.firestore()

export default async function myData(req: any, res: any) {
  const myUID: string = req.body.uid
  await db
    .collection('users')
    .doc(myUID)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.status(200).json(doc.data())
        return
      } else {
        res.status(500).json({ error: 'No such document!' })
        return
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: error })
      return
    })
}
