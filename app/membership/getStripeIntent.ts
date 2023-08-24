export default async function getStripeIntent() {
  try {
    const intent = await fetch('api/stripe/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000 * 100,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        return data
      })
    return intent
  } catch (err: any) {
    console.log(err)
    return null
  }
}
