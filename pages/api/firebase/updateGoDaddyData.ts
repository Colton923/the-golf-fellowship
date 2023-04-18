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
    sku,
    status,
    name,
    email,
    phone,
    shippingAddress,
    billingAddress,
    date,
    subTotal,
    salesTax,
    term,
    club,
    plan,
  } = req.body
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
    doc.forEach((doc) => {
      doc.ref.update({
        orderTotal,
        sku,
        status,
        name,
        email,
        phone,
        shippingAddress,
        billingAddress,
        date,
        subTotal,
        salesTax,
        term,
        club,
        plan,
      })
    })
  }
  await UpdateSingleDocument(orderNumber).then(() => {
    res.status(200).json({ success: true })
  })
}
