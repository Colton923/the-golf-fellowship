'use client'
import { Button, Card, Text } from '@mantine/core'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import router from 'next/router'

import type { body } from '@api/stripe/stripe_newSubscription'

type Props = {
  interval: 'day' | 'week' | 'month' | 'year'
  intervalCount: number
  membershipType: string
  chapter: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  paymentIntentId: string
  fee: number
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
    interval,
    intervalCount,
    chapter,
    membershipType,
    firstName,
    lastName,
    phoneNumber,
    email,
    paymentIntentId,
    fee,
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
    const data: body = {
      sub: {
        name: chapter + ' ' + membershipType + ' ' + interval + ' ' + intervalCount,
        description:
          'TGF ' +
          chapter +
          ' ' +
          membershipType +
          ' ' +
          interval +
          ' ' +
          intervalCount,
        unit_amount: fee * 100,
        currency: 'usd',
        recurring: {
          interval: interval,
          interval_count: intervalCount,
        },
      },
    }

    const handlePostSubscription = async (data: SubscriptionPostBody) => {
      return await fetch('/api/stripe/stripe_newSubscription', {
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
    handlePostSubscription(data).then((data) => {
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
          chapter: chapter ? chapter : '',
          membershipType: membershipType ? membershipType : '',
          interval: interval ? interval : '',
          intervalCount: intervalCount ? intervalCount : '',
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
        amount: fee,
        payment_intent_id: paymentIntentId,
        metadata: {
          id: stripeSubId,
        },
      }),
    })
  }, [stripeSubId, paymentIntentId])

  return (
    <Card shadow="sm" padding="sm" radius="sm">
      <Text ta={'center'}>{`Thanks, ${firstName}!`}</Text>
      <Text ta={'left'}>
        You will receive a text message to verify your phone number.
      </Text>
      <Text ta={'center'} fw={'bold'}>{`Total: $${fee.toFixed(2)}`}</Text>
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
