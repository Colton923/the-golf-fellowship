'use client'
import { Button, Card } from '@mantine/core'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import router from 'next/router'

type Props = {
  city: string
  frequency: string
  term: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  paymentIntentId: string
}
type SubscriptionPostBody = {
  sub: {
    name: string
    description: string
    unit_amount: number
    currency: string
    recurring: {
      aggregate_usage?: string
      interval: 'day' | 'week' | 'month' | 'year'
      interval_count?: number
      trial_period_days?: string
      usage_type?: string
    }
  }
}

interface MembershipFormProps {
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

const standardizePhone = (phone: string) => {
  //###-###-####
  let newPhone = phone.replace(/[^0-9]/g, '')
  if (newPhone.length === 10) {
    newPhone = newPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  } else {
    return false
  }
  return newPhone
}
const MembershipCheckout = (props: Props) => {
  const {
    city,
    frequency,
    term,
    firstName,
    lastName,
    phoneNumber,
    email,
    paymentIntentId,
  } = props
  const [stripeSubId, setStripeSubId] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [priceID, setPriceID] = useState('')
  const [message, setMessage] = useState('')

  const HandleSubmit = async (e: any) => {
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
        receipt_email: email,
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

    if (!stripe || !elements) {
      console.log('not loaded')
      // Stripe.js has not yet loaded.
      return
    }

    const phone = standardizePhone(phoneNumber)
    if (!phone) return
    const data = {
      city: city,
      frequency: frequency,
      term: term,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
    }
    const handlePostSubscription = async (data: SubscriptionPostBody) => {
      return await fetch('/api/stripe/createSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          return data
        })
        .catch((err) => {
          console.log(err)
          return false
        })
    }
    handlePostSubscription({
      sub: {
        name: city + ' ' + frequency + ' ' + term,
        description: 'TGF ' + city + ' ' + frequency + ' ' + term,
        unit_amount: 1000,
        currency: 'usd',
        recurring: {
          interval: frequency === 'frequent' ? 'month' : 'year',
          interval_count: term === 'Monthly-6' ? 6 : term === 'Monthly-12' ? 12 : 1,
        },
      },
    }).then((data) => {
      if (!data) return
      const updatedSubscription = data
      console.log('updatedSubscription', updatedSubscription)
      setIsLoading(false)
      setStripeSubId(updatedSubscription.id)
    })
  }

  useEffect(() => {
    const fetchPriceId = async () => {
      await fetch('/api/stripe/prodId_to_priceId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prodId: stripeSubId ? stripeSubId : '',
        }),
      }).then((res) => {
        res.json().then((data) => {
          //@ts-ignore
          setPriceID(data.price)
        })
      })
    }
    fetchPriceId()
  }, [stripeSubId])

  const firstTimeUserLogin = async (uid: string) => {
    await fetch('/api/firebase/firstTimeUserLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName ? firstName : '',
        lastName: lastName ? lastName : '',
        email: email ? email : '',
        phone: phoneNumber ? phoneNumber : '',
        uid: uid ? uid : '',
        address: '',
        membership: {
          city: city ? city : '',
          term: term ? term : '',
          frequency: frequency ? frequency : '',
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
            router.push('/dashboard')
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
    const reCaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })
    const appVerifier = reCaptchaVerifier
    const phone = '+1' + phoneNumber.replace('+1', '').replace(/-/g, '')

    signInWithPhoneNumber(auth, phone, appVerifier)
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
            router.replace('/membership')
          })
      })
      .catch((error) => {
        if (error.message.includes('auth/too-many-requests')) {
          alert('Too many requests from your IP. Blocked for 1 hour.')
        } else {
          alert('Error validating phone. Payment processed. Please login.')
        }
        router.replace('/membership')
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
        amount: 1000,
        payment_intent_id: paymentIntentId,
        metadata: {
          id: stripeSubId,
        },
      }),
    })
  }, [stripeSubId, paymentIntentId])

  return (
    <Card shadow="sm" padding="sm" radius="sm">
      <div id="recaptcha-container"></div>
      <form id="payment-form" onSubmit={HandleSubmit}>
        <PaymentElement id="payment-element" />
        <Button
          mt={'xs'}
          disabled={!stripe}
          id="submit"
          color="dark"
          variant="filled"
          type="submit"
        >
          <span id="button-text">Pay</span>
        </Button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </Card>
  )
}

export default MembershipCheckout
