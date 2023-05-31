import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export default async function updateGoDaddyData(req: any, res: any) {
  const {
    orderNumber,
    orderTotal,
    billingAddress,
    date,
    firstName,
    lastName,
    phone,
    salesTax,
    shippingAddress,
    subTotal,
    products,
    email,
  } = req.body.data
  const db = admin.firestore()
  const colRef = db.collection('goDaddy')
  const UpdateSingleDocument = async (search: string) => {
    const docRef = colRef.where('orderNumber', '==', search).limit(1)
    const doc = await docRef.get()
    if (doc.empty) {
      return
    }
    if (doc.size > 1) {
      return
    }
    doc.forEach(async (doc) => {
      console.log('updating', orderNumber)
      await doc.ref.set({
        orderNumber,
        orderTotal,
        billingAddress,
        date,
        firstName,
        lastName,
        phone,
        salesTax,
        shippingAddress,
        subTotal,
        products,
        email,
      })
    })
    return
  }

  await UpdateSingleDocument(orderNumber).then(() => {
    res.status(200).json({ success: true })
  })
}
