import { db } from '../firebase/firebaseClient'
import { collection, getDocs, doc } from 'firebase/firestore'

const stripeProducts = async () => {
  const products: any[] = []
  const colRef = collection(db, 'products')
  const querySnapshot = await getDocs(colRef)
  querySnapshot.forEach(async (doc) => {
    const priceRef = collection(db, 'products', doc.id, 'prices')
    const getPrice = await getDocs(priceRef)
    const price = getPrice.docs[0].data()['unit_amount'] / 100
    products.push({
      key: Math.floor(
        Math.random() * 1 + Math.random() * 10 + Math.random() * 100 + Math.random() * 1000
      ),
      name: doc.data().name,
      price: price,
    })
  })
  return products
}

export default stripeProducts
