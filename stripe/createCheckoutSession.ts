import initializeStripe from './initializeStripe'
import { collection, doc, addDoc } from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'

export async function createCheckoutSession(uid: string) {
  const userRef = collection(db, 'users')
  const docRef = doc(userRef, uid)
  const checkoutRef = collection(docRef, 'checkout_sessions')
  const checkoutSessionRef = await addDoc(checkoutRef, {
    price: 'price_1M9f7wHTfilzsGXG9P9mvDVn',
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  })

  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(checkoutSessionRef, async (snapshot) => {
    const data = snapshot.data()
    if (data?.sessionId) {
      // We have a session, let's redirect to Checkout
      // Init Stripe
      const stripe = await initializeStripe()
      stripe?.redirectToCheckout({ sessionId: data.sessionId })
    }
  })
}
