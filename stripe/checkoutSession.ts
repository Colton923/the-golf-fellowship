import initializeStripe from './initializeStripe'
import { collection, doc, addDoc } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { onSnapshot } from 'firebase/firestore'

export async function checkoutSession(uid: string, prices: string[], names: string[]) {
  const lineItems = prices.map((price) => {
    return {
      price,
      quantity: 1,
    }
  })
  const itemNames = names.join(', ')

  const params: any = {
    success_url: window.location.origin,
    cancel_url: window.location.origin,
    line_items: lineItems,
    metadata: {
      firebaseUID: uid,
      itemNames: itemNames,
    },
  }
  const userRef = collection(db, 'users')
  const docRef = doc(userRef, uid)
  const checkoutRef = collection(docRef, 'checkout_sessions')
  const checkoutSessionRef = await addDoc(checkoutRef, params)

  try {
    onSnapshot(checkoutSessionRef, async (snapshot) => {
      const data = snapshot.data()
      console.log('data', data)
      if (data?.sessionId) {
        const stripe = await initializeStripe()
        stripe?.redirectToCheckout({ sessionId: data.sessionId })
      } else {
        console.log('No sessionId')
      }
    })
  } catch (e) {
    console.log('error', e)
  }
}

export default checkoutSession
