import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.firestore()

export default async function isPhoneNumberInDB(req: any, res: any) {
  let phoneNumber: string = req.body.phoneNumber
  if (phoneNumber.charAt(0) === '+') {
    phoneNumber = phoneNumber.slice(1)
  }
  if (phoneNumber.charAt(0) === '1') {
    phoneNumber = phoneNumber.slice(1)
  }
  await db
    .collection('users')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().phone === phoneNumber) {
          res.status(200).json({ isPhoneNumberInDB: true })
          return
        }
      })
    })
    .then(() => {
      res.status(200).json({ isPhoneNumberInDB: false })
      return
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ isPhoneNumberInDB: false })
      return
    })
}
