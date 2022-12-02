'use client'

import React, { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import initializeStripe from '../../stripe/initializeStripe'

const stripe = initializeStripe()

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntent, setPaymentIntent] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads using our local API
    fetch('../../pages/api/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 300 * 100,
        payment_intent_id: '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret), setPaymentIntent(data.id)
      })
  }, [])

  const appearance = {
    theme: 'stripe',
    labels: 'floating',
  }
  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div>
      <h1 className="">Accept payments with credit card</h1>
      <div className="">
        <div className="">
          <img src="" alt="" />
        </div>
        <div className="">+</div>
        <div className="">
          <img src="" alt="" />
        </div>
      </div>
      {clientSecret && (
        // @ts-ignore
        <Elements options={options} stripe={stripe}>
          <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
      )}
    </div>
  )
}
