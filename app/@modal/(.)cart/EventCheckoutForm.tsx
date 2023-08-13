'use client'

import { User } from 'firebase/auth'
import styles from '@components/membership/Membership.module.css'
import {
  useElements,
  useStripe,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { Button, Card, Group, Text, Title } from '@mantine/core'
import { useSiteContext } from '@components/context/Context'

type Props = {
  user: User
  cartTotal: number
}

const EventCheckoutForm = (props: Props) => {
  const { user } = props
  const { router, myUserData } = useSiteContext()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

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
        receipt_email: user.email || '',
        return_url: 'https://www.kerryniester.com/dashboard',
      },
      redirect: 'if_required',
    })

    if (error) {
      //@ts-ignore
      setMessage(error.message)
      console.log(error)
      router.back()
    } else {
      setMessage('Payment succeeded!')
      router.back()
    }

    setIsLoading(false)
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
          router.push('/dashboard')
          break
      }
    })
  }, [stripe])

  if (!myUserData) return null
  return (
    <>
      <div id="recaptcha-container"></div>
      <Card shadow="sm" padding="sm" radius="sm">
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" />
          <Button
            mt={'xs'}
            disabled={isLoading || !stripe || !elements}
            id="submit"
            color="dark"
            variant="filled"
            type="submit"
          >
            <span id="button-text">
              {isLoading ? (
                <div className={styles.stripeFormButton} id="spinner"></div>
              ) : (
                'Pay'
              )}
            </span>
          </Button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </form>
      </Card>
    </>
  )
}

export default EventCheckoutForm
