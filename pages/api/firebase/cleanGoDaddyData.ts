import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export default async function updateGoDaddyData(req: any, res: any) {
  const db = admin.firestore()
  const colRef = db.collection('goDaddy')
  let deleteCount = 0
  const CleanUpDatabase = async () => {
    const docRef = colRef.where('date', '==', '')
    const doc = await docRef.get()
    if (doc.empty) {
      return
    }
    doc.forEach((doc) => {
      deleteCount++
      doc.ref.delete()
    })
  }
  await CleanUpDatabase().then(() => {
    res
      .status(200)
      .json({ message: 'Database cleaned up', deleteCount: deleteCount })
  })
}
