'use client'

import Cart from '@components/cart/Cart'
import { useSiteContext } from '@components/context/Context'
import { Space, Flex, Button, Modal, Center, Container } from '@mantine/core'
import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import type { User } from 'firebase/auth'
import EventCheckoutForm from './EventCheckoutForm'
import { loadStripe } from '@stripe/stripe-js'

const stripe = loadStripe(
  //@ts-ignore
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

export default function Page() {
  const { cartOpened, HandleClosingCart, cart, user, cartTotal, myUserData } =
    useSiteContext()
  const [checkingOut, setCheckingOut] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntent, setPaymentIntent] = useState('')

  //Initialize stripe payment intent
  useEffect(() => {
    if (!myUserData) return
    if (!cartTotal) return
    fetch('api/stripe/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: cartTotal * 100,
        customer: myUserData.stripeId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret), setPaymentIntent(data.id)
      })
  }, [cartTotal])

  const options = {
    clientSecret: clientSecret,
    appearance: {
      /*...*/
    },
  }

  if (!user) return null
  if (!HandleClosingCart || !cartOpened) return null
  if (!cartTotal) return null

  return (
    <Modal
      yOffset={'20vh'}
      opened={cartOpened}
      onClose={HandleClosingCart}
      title={`Total: $${cartTotal}`}
    >
      {checkingOut && stripe && options && user && cartTotal && (
        <Elements stripe={stripe} options={options}>
          <EventCheckoutForm cartTotal={cartTotal} user={user} />
        </Elements>
      )}
      {!checkingOut && (
        <>
          <Flex
            direction="row"
            justify="center"
            align="center"
            w={'100%'}
            wrap={'wrap'}
          >
            <Cart />
          </Flex>
          <Button
            color="dark"
            variant="filled"
            mt={'xs'}
            style={{
              display: 'flex',
              position: 'sticky',
              width: '100%',
              bottom: '0',
              left: '0',
              right: '0',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => {
              setCheckingOut(true)
            }}
          >
            Checkout
          </Button>
        </>
      )}
    </Modal>
  )
}
