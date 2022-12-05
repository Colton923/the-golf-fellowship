
import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import styles from '../../styles/ProShop.module.css';

export default function Form(paymentIntent:any) {
  const [email, setEmail] = useState('');
  const [locAmount, setLocAmount] = useState('300');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    //Grab the client secret from url params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      //@ts-ignore
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);


  const handleAmount = async (val:any) => {
    setLocAmount(val);
    fetch('api/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: val * 100,
        payment_intent_id: paymentIntent.paymentIntent,
      }),
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('not loaded');
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://kerryniester.com/success',
        receipt_email: email,
        shipping: {
          name: 'Jenny Rosen',
          address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
        },
      },
    },
    });


    if (error.type === 'card_error' || error.type === 'validation_error') {
      console.log(error.message);
    } else {
      setMessage('An unexpected error occured.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit} className={styles.stripeForm}>
        <div>
          <h1 className={styles.stripeFormCart}>Cart Total:</h1>
          <h1 className={styles.stripeFormCart} >
          {'$'+locAmount + '.00'}
          </h1>
        </div>
        <div className={styles.stripeFormCart}>
          Email address:
          <input
            className={styles.stripeFormCartTextInput}
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email for Payment Receipt"
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
  );
}
