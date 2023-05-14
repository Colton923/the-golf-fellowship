import React, { useEffect, useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { getAuth } from 'firebase/auth'

import styles from '../membership/Membership.module.css'

interface CheckoutFormProps {
  stripeSubId: string
  paymentIntentId: string
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
  city: string
  plan: string
  term: string
  subTerm?: string
  status: string
  quantity: number
}

export default function CheckoutForm(props: CheckoutFormProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [priceID, setPriceID] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  useEffect(() => {
    const fetchPriceId = async () => {
      await fetch('/api/stripe/prodId_to_priceId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prodId: props.stripeSubId ? props.stripeSubId : '',
        }),
      }).then((res) => {
        res.json().then((data) => {
          //@ts-ignore
          setPriceID(data.price)
        })
      })
    }
    fetchPriceId()
  }, [props.stripeSubId])

  const firstTimeUserLogin = async (uid: string) => {
    await fetch('/api/firebase/firstTimeUserLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: props.firstName ? props.firstName : '',
        lastName: props.lastName ? props.lastName : '',
        email: props.email ? props.email : '',
        phone: props.phone ? props.phone : '',
        uid: uid ? uid : '',
        address: props.address ? props.address : '',
        membership: {
          city: props.city ? props.city : '',
          plan: props.plan ? props.plan : '',
          term: props.term ? props.term : '',
          subTerm: props.subTerm ? props.subTerm : '',
          status: props.status ? props.status : '',
          quantity: props.quantity ? props.quantity : 0,
        },
        priceID: priceID ? priceID : '',
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }),
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            router.replace('/dashboard')
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
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
    const phoneNumber = '+1' + props.phone.replace('+1', '').replace(/-/g, '')
    //FOR TESTING ONLY: Replace '+16505551234' with phoneNumber, and uncomment
    //const code = window.prompt('Verify Phone Number for Membership Login:')
    //also replace '123456' with code

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
        if (error.message.includes('auth/too-many-requests')) {
          alert('Too many requests from your IP. Blocked for 1 hour.')
        } else {
          alert('Error validating phone. Payment processed. Please login.')
        }
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
    fetch('api/stripe/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: props.amount,
        payment_intent_id: props.paymentIntentId,
        metadata: {
          id: props.stripeSubId,
        },
      }),
    })
  }, [props.amount, props.stripeSubId, props.paymentIntentId])

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
        return_url: 'https://www.kerryniester.com/dashboard',
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
