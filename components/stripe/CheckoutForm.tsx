import React, { useEffect, useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { getAuth } from 'firebase/auth'

import styles from '../membership/Membership.module.css'

interface CheckoutFormProps {
  paymentIntent: any
  email: string
  phone: string
  firstName: string
  lastName: string
  amount: number
  address: {
    country: string
    street: string
    opt?: string
    postalCode: string
    city: string
    state: string
    special?: string
  }
  membership: {
    city: string
    plan: string
    term: string
    subTerm?: string
    status: string
    quantity: number
  }
}

export default function CheckoutForm(props: CheckoutFormProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const firstTimeUserLogin = async (uid: string) => {
    await fetch('/api/firebase/firstTimeUserLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: props.firstName,
        lastName: props.lastName,
        email: props.email,
        phone: props.phone,
        uid: uid,
        address: props.address,
        membership: {
          city: props.membership.city,
          plan: props.membership.plan,
          term: props.membership.term,
          subTerm: props.membership.subTerm ? props.membership.subTerm : '',
          status: props.membership.status,
          quantity: props.membership.quantity,
        },
      }),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data)
        router.replace('/dashboard')
      })
    })
  }

  const NewUserSignIn = () => {
    const auth = getAuth()
    const reCaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      auth
    )
    const appVerifier = reCaptchaVerifier
    const phoneNumber = '+1' + props.phone
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        const code = window.prompt('Verify Phone Number for Membership Login:')
        confirmationResult
          //@ts-ignore
          .confirm(code)
          .then((result) => {
            firstTimeUserLogin(result.user.uid)
            alert('Sign in Successful')
          })
          .catch((error) => {
            alert('Sign in Failed')
            router.replace('/')
          })
      })
      .catch((error) => {
        console.log('error: ', error)
        alert('Error validating phone. Payment processed. Please login.')
        router.replace('/')
      })
  }

  useEffect(() => {
    if (!stripe) {
      return
    }

    //Grab the client secret from url params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      //@ts-ignore
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  useEffect(() => {
    fetch('api/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: props.amount,
        payment_intent_id: props.paymentIntent,
      }),
    })
  }, [
    props.amount,
    props.email,
    props.phone,
    props.firstName,
    props.lastName,
    props.address,
    props.paymentIntent,
  ])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.log('not loaded')
      // Stripe.js has not yet loaded.
      return
    }
    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: props.email,
      },
      redirect: 'if_required',
    })

    if (error) {
      //@ts-ignore
      setMessage(error.message)
      console.log(error)
    } else {
      setMessage('Payment succeeded!')
      NewUserSignIn()
    }

    setIsLoading(false)
  }

  return (
    <>
      <div id="recaptcha-container"></div>
      <form id="payment-form" onSubmit={handleSubmit} className={styles.stripeForm}>
        <div>
          <h1 className={styles.stripeFormCart}>
            Cart Total:{'$' + props.amount / 100 + '.00'}
          </h1>
        </div>
        <div className={styles.stripeFormCart}>
          Email address:
          <input
            className={styles.stripeFormCartTextInput}
            id="email"
            type="text"
            value={props.email}
            onChange={(e) => {
              props.email = e.target.value
            }}
            placeholder="Enter Email for Payment Receipt"
          />
        </div>
        <div className={styles.stripeFormCart}>
          Phone Number:
          <input
            className={styles.stripeFormCartTextInput}
            id="phone"
            type="text"
            value={props.phone}
            onChange={(e) => {
              props.phone = e.target.value
            }}
            placeholder="123-456-7890"
          />
        </div>
        <PaymentElement id="payment-element" />
        <button
          className={styles.stripeFormButton}
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className={styles.stripeFormButton} id="spinner"></div>
            ) : (
              'Pay'
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  )
}
