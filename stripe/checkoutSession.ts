import initializeStripe from './initializeStripe'
import { collection, doc, addDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { onSnapshot } from 'firebase/firestore'

export async function checkoutSession(
  uid: string,
  prices: string[],
  names: string[]
) {
  const lineItems = prices.map((price) => {
    return {
      price,
      quantity: 1,
    }
  })
  const itemNames = names.join(', ')

  const userRef = collection(db, 'users')
  const docRef = doc(userRef, uid)
  const userData = await getDoc(docRef)
  const myData = userData.data()
  const params: any = {
    success_url: window.location.origin + '/dashboard',
    cancel_url: window.location.origin + '/dashboard',
    customerEmail: myData ? (myData.email ? myData?.email : '') : '',
    line_items: lineItems,
    metadata: {
      firebaseUID: uid,
      itemNames: itemNames,
    },
    mode: 'payment',
  }
  const checkoutRef = collection(docRef, 'checkout_sessions')
  const checkoutSessionRef = await addDoc(checkoutRef, params)

  try {
    onSnapshot(checkoutSessionRef, async (snapshot) => {
      const data = snapshot.data()
      if (data?.sessionId) {
        const stripe = await initializeStripe()
        stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        })
      } else {
        console.log('No sessionId')
      }
    })
  } catch (e) {
    console.log('error', e)
  }
}

export default checkoutSession
