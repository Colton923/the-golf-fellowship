import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripePromise: Stripe | null = null

const initializeStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
      'pk_test_51M9ezjHTfilzsGXGKY0NIqo2Bs8GXz7EuDSlnho3pRLwUDHxWvyNaWXPTfcrsSldAgdFRnNW3En3uJ8Uvl4HPOOa005Rk5TD7t'
    )
  }
  return stripePromise
}
export default initializeStripe
