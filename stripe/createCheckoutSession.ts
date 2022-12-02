import initializeStripe from './initializeStripe'
import { collection, doc, addDoc } from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'

export async function createCheckoutSession(uid: string, prices: string[]) {
  const userRef = collection(db, 'users')
  const docRef = doc(userRef, uid)
  const checkoutRef = collection(docRef, 'checkout_sessions')
  let total = 0
  prices.forEach(async (thisPrice) => {
    const checkoutSessionRef = await addDoc(checkoutRef, {
      price: thisPrice,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    })
    onSnapshot(checkoutSessionRef, (snap) => {
      const data = snap.data()
      if (data?.sessionId) {
        total += parseInt(thisPrice)
      }
    })
  })
  const stripe = await initializeStripe()

  if (total > 0) {
        stripe?.redirectToCheckout(

          { sessionId: sessionObject },
        )

        sessionObject = await stripe?.checkout.sessions.create({

        checkout.sessions.create({
          customer: stripeCustomerId,
          mode: data.mode,
          payment_method_types: [
            'card',
          ],
          success_url: `${MY_DOMAIN}/admin/stripe`,
          cancel_url: `${MY_DOMAIN}/admin/stripe`,
          line_items: [ // all arguments are required
            {
              price_data: {
                unit_amount: 4000,
                currency: 'usd',
                product_data: {
                  name: 'Test Product'
                },
              },
              quantity: 1,
            },
          ],
        })

      }
    })
    total = 0
  } else {
    total = 0
    console.log('No prices')
  }
}
