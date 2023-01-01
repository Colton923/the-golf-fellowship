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
  const phoneNumber = req.body.phoneNumber
  console.log('phoneNumber: ', phoneNumber)
  const searchDocs = await db.collection('users').get()
  const searchDocsData = searchDocs.docs.map((doc) => doc.data())
  const searchDocsDataPhoneNumbers = searchDocsData.map((doc) => doc.phone)
  const isPhoneNumberInDB = searchDocsDataPhoneNumbers.includes(phoneNumber)
  res.status(200).json({ isPhoneNumberInDB: isPhoneNumberInDB })
}
