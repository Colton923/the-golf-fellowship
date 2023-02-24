'use client'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import styles from './Membership.module.css'
import CheckoutForm from '../stripe/CheckoutForm'
import { auth, db } from '../../firebase/firebaseClient'
import productImage from '../../public/static/images/membershipImage.jpg'
import CardOne from './cards/CardOne/CardOne'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import ProgressBar from '@components/progressBar/ProgressBar'

import type { DefaultMembership } from '../../types/data/DefaultMembership'
import type { CustomerData } from '../../types/data/CustomerData'
import type { FormData } from '../../types/data/FormData'
import type { CardTwoSubmitProps } from '../../types/props/CardTwoSubmitProps'
type CreateNewSubscription = {
  requestData: body
}

type body = {
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
  uid: string
}

const stripe = loadStripe(
  //@ts-ignore
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

export default function Membership() {
  const [user] = useAuthState(auth)
  const [membershipOptions, setMembershipOptions] = useState({} as DefaultMembership)
  const [showCardTwo, setShowCardTwo] = useState(false)
  const [showSubTerm, setShowSubTerm] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [showTerm, setShowTerm] = useState(false)
  const [showQuantity, setShowQuantity] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [showPrice, setShowPrice] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutData, setCheckoutData] = useState({} as FormData)
  const [totalPrice, setTotalPrice] = useState(1)
  const [stage, setStage] = useState(0)
  const [city, setCity] = useState('')
  const [customerData, setCustomerData] = useState({} as CustomerData)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('')
  const [selectedSubTerm, setSelectedSubTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showStripeElement, setShowStripeElement] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntent, setPaymentIntent] = useState('')
  const [stripeSubId, setStripeSubId] = useState('')
  const [lineItemPrice, setLineItemPrice] = useState(0)
  const [intervalPurchase, setIntervalPurchase] = useState('')
  const [subStatusMessage, setSubStatusMessage] = useState('')
  const [focusedElementID, setFocusedElementID] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userFirstName, setUserFirstName] = useState('')
  const [userLastName, setUserLastName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userCity, setUserCity] = useState('')
  const [userPostal, setUserPostal] = useState('')
  const [userState, setUserState] = useState('')
  const [userStreet, setUserStreet] = useState('')
  const [userStreetTwo, setUserStreetTwo] = useState('')
  const [userSpecial, setUserSpecial] = useState('')
  const [showCardOne, setShowCardOne] = useState(true)
  const [collapseCity, setCollapseCity] = useState(false)
  const [collapsePlan, setCollapsePlan] = useState(false)
  const [collapseTerm, setCollapseTerm] = useState(false)
  const [collapseSubTerm, setCollapseSubTerm] = useState(false)
  const [collapseStatus, setCollapseStatus] = useState(false)

  useEffect(() => {
    if (city !== '') {
      setCollapseCity(true)
    }
  }, [city])

  const isCardOneValid = useCallback((valid: boolean) => {
    setShowCardTwo(valid)
  }, [])

  //handles the user focus on the form
  useEffect(() => {
    const handleNewFocusedElement = () => {
      const focusedElement = document.getElementById(focusedElementID)
      focusedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    handleNewFocusedElement()
  }, [focusedElementID])

  //Initialize stripe payment intent
  useEffect(() => {
    fetch('api/stripe/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalPrice * 100,
        payment_intent_id: '',
        metadata: {
          id: stripeSubId,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret), setPaymentIntent(data.id)
      })
  }, [totalPrice, stripeSubId])

  const options = {
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  }

  //Convert this to a dynamic data read when the membership schema is finalized
  const membershipRef = collection(db, 'membership')
  const cities = ['San Antonio', 'Austin', 'DFW', 'Houston', 'Hill Country']
  const status = {
    returning: {
      title: 'Returning',
      price: 0,
    },
    new: {
      title: 'New',
      price: 2500,
    },
  }

  //Dynamic read of membership schema for pricing
  useEffect(() => {
    const getMembershipOptions = async () => {
      const membershipDoc = await getDocs(membershipRef)
      const onlyDoc = membershipDoc.docs[0]
      const data = onlyDoc.data()
      const DefaultMembership = data['plans']
      setMembershipOptions(DefaultMembership)
      setShowCardOne(true)
    }
    getMembershipOptions()
  }, [])

  //FormData is 'Card Two' form data
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  //CustomerData is 'Card Three' form data
  const {
    register: customerRegister,
    setValue: customerSetValue,
    handleSubmit: customerHandleSubmit,
    formState: { errors: customerErrors },
  } = useForm<CustomerData>()

  //OnSubmit for 'Card Three' form. This sends user to stripe checkout.
  const submitCustomerForm = (data: CustomerData) => {
    data.amount = totalPrice * 100
    data.phone = userPhone
    setCustomerData(data)
    setStage(2)
    setShowCardTwo(false)
    setShowCheckout(false)
    setShowStripeElement(true)
    setShowCardOne(false)
  }

  //Dynamically creates stripe products based on the membership schema
  useEffect(() => {
    if (intervalPurchase !== '') {
      const purchaseItem: body = {
        sub: {
          name: selectedPlan + ' ' + selectedTerm,
          description: selectedSubTerm
            ? selectedSubTerm + ' ' + selectedCity
            : selectedCity,
          unit_amount: lineItemPrice,
          currency: 'usd',
          recurring: {
            //@ts-ignore
            interval: intervalPurchase,
          },
        },
      }
      const stripeSubscriptionID: CreateNewSubscription = {
        requestData: purchaseItem,
      }
      const NewSubscription = async (
        stripeSubscriptionID: CreateNewSubscription
      ) => {
        try {
          fetch('api/stripe/stripe_list_products', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
            .then((res) => res.json())
            .then((data) => {
              setSubStatusMessage('Checking for existing subscription')
              const stripeData = data.data
              if (
                stripeData
                  .map((item: any) => item.name)
                  .includes(selectedPlan + ' ' + selectedTerm) &&
                stripeData
                  .map((item: any) => item.description)
                  .includes(
                    selectedSubTerm
                      ? selectedSubTerm + ' ' + selectedCity
                      : selectedCity
                  )
              ) {
                const subId = stripeData.filter(
                  (item: any) =>
                    item.name === selectedPlan + ' ' + selectedTerm &&
                    (item.description === selectedSubTerm
                      ? selectedSubTerm + ' ' + selectedCity
                      : selectedCity)
                )[0].id
                setStripeSubId(subId)
                setSubStatusMessage('Subscription found')
              } else {
                setSubStatusMessage('Creating new subscription')
                try {
                  fetch('api/stripe/stripe_subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(stripeSubscriptionID.requestData),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setStripeSubId(data.product.toString())
                      setSubStatusMessage('Subscription created')
                    })
                } catch (error: any) {
                  setSubStatusMessage('Error creating subscription')
                }
              }
            })
        } catch (error: any) {
          setSubStatusMessage('Error checking for existing subscription')
        }
        return stripeSubId
      }
      NewSubscription(stripeSubscriptionID)
    }
  }, [intervalPurchase])

  return (
    <div className={styles.contentWrap}>
      <ProgressBar stage={stage} />
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.image}>
            <Image
              src={productImage}
              alt="TGF Membership"
              width={100}
              height={100}
            />
          </div>
          <h1 className={styles.itemTitle} id="top">
            TGF MEMBERSHIP
          </h1>
        </div>
        {showCardOne && (
          <CardOne
            {...{
              isCardOneValid,
              setUserFirstName,
              setUserLastName,
              setUserEmail,
              setUserPhone,
            }}
          />
        )}

        {/* CARD THREE */}
        {showCheckout && (
          <div className={styles.cardForm}>
            <div className={styles.cardFormItem}>
              <div className={styles.cardFormItemGroup}>
                <h1 className={styles.cardFormSummaryTitle}>
                  TGF MEMBERSHIP SUMMARY
                </h1>
                <div className={styles.cardFormOptionWrap}>
                  <button
                    id="backButton"
                    className={styles.backButton}
                    onClick={() => (
                      setShowCheckout(false),
                      setShowCardTwo(false),
                      setCheckoutData({
                        city: '',
                        plan: '',
                        quantity: 1,
                        status: '',
                        subTerm: '',
                        term: '',
                      } as FormData),
                      setCity(''),
                      setStage(0),
                      setSelectedPlan(''),
                      setSelectedTerm(''),
                      setSelectedSubTerm(''),
                      setSelectedStatus(''),
                      setSelectedCity(''),
                      setShowStatus(false),
                      setShowQuantity(false),
                      setShowTerm(false),
                      setShowPlan(false),
                      setShowSubTerm(false),
                      setShowPrice(false),
                      setShowCardOne(true),
                      setCollapseStatus(false),
                      setCollapseCity(false),
                      setCollapsePlan(false),
                      setCollapseTerm(false),
                      setCollapseSubTerm(false)
                    )}
                  >
                    BACK
                  </button>
                </div>
                <div className={styles.cardFormItemGroup}>
                  <div className={styles.cartGroup}>
                    <div className={styles.cartSubGroup}>
                      <h1 className={styles.cartItemTitle}>CITY</h1>
                      <h1 className={styles.cartItemSubTitle}>
                        {checkoutData.city}
                      </h1>
                    </div>
                    <div className={styles.cartSubGroup}>
                      <h1 className={styles.cartItemTitle}>PLAN</h1>
                      <h1 className={styles.cartItemSubTitle}>
                        {' '}
                        {checkoutData.plan.toUpperCase()}
                      </h1>
                    </div>
                    <div className={styles.cartSubGroup}>
                      <h1 className={styles.cartItemTitle}>TERM</h1>
                      <h1 className={styles.cartItemSubTitle}>
                        {checkoutData.term.toUpperCase()}
                      </h1>
                    </div>
                    {checkoutData.subTerm && (
                      <>
                        <div className={styles.cartSubGroup}>
                          <h1 className={styles.cartItemTitle}>SUB TERM</h1>
                          <h1 className={styles.cartItemSubTitle}>
                            {checkoutData.subTerm.toUpperCase()}
                          </h1>
                        </div>
                      </>
                    )}
                    <div className={styles.cartSubGroup}>
                      <h1 className={styles.cartItemTitle}>STATUS</h1>
                      <h1 className={styles.cartItemSubTitle}>
                        {checkoutData.status.toUpperCase()}
                      </h1>
                    </div>
                    <div className={styles.cartSubGroup}>
                      <h1 className={styles.cartItemTitle}>QUANTITY</h1>
                      <h1 className={styles.cartItemSubTitle}>
                        {checkoutData.quantity}
                      </h1>
                    </div>
                    <div className={styles.cartSubGroup}>
                      <h1 className={styles.cartItemTitle}>TOTAL</h1>
                      <h1 className={styles.cartItemSubTitle}>${totalPrice}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={customerHandleSubmit(submitCustomerForm)}>
              <div className={styles.cardFormItem}>
                <div className={styles.cardFormItemGroup}>
                  <h1 className={styles.cardFormItemLabel}>CUSTOMER INFORMATION</h1>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="emailAddress"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="Email Address"
                        {...customerRegister('email', {
                          required: true,
                        })}
                        onKeyUp={() => {
                          setFocusedElementID('phoneNumber')
                        }}
                        defaultValue={userEmail !== '' ? userEmail : undefined}
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="phoneNumber"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="123-456-7890"
                        onKeyUp={() => {
                          setFocusedElementID('shippingFirst')
                        }}
                        defaultValue={userPhone}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.cardFormItem}>
                <div className={styles.cardFormItemGroup}>
                  <h1 className={styles.cardFormItemLabel}>
                    SHIPPING ADDRESS (FREE SHIPPING)
                  </h1>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingFirst"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="First Name"
                        {...customerRegister('firstName', {
                          required: true,
                        })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingLast')
                        }}
                        defaultValue={
                          userFirstName !== '' ? userFirstName : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingLast"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="Last Name"
                        {...customerRegister('lastName', {
                          required: true,
                        })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingStreet')
                        }}
                        defaultValue={userLastName !== '' ? userLastName : undefined}
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingCountry"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="United States"
                        defaultValue={'United States'}
                        {...customerRegister('address.country', { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingStreet"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="Street Address"
                        {...customerRegister('address.street', { required: true })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingApt')
                        }}
                        defaultValue={userStreet !== '' ? userStreet : undefined}
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingApt"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="Apt, Unit, Suite, etc (optional)"
                        {...customerRegister('address.opt', { required: false })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingPostal')
                        }}
                        defaultValue={
                          userStreetTwo !== '' ? userStreetTwo : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingPostal"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="Postal / Zip"
                        {...customerRegister('address.postalCode', {
                          required: true,
                        })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingCity')
                        }}
                        defaultValue={userPostal !== '' ? userPostal : undefined}
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingCity"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="City"
                        {...customerRegister('address.city', { required: true })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingState')
                        }}
                        defaultValue={userCity !== '' ? userCity : undefined}
                      />
                    </div>
                  </div>
                  <div className={styles.optionInputShippingWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        id="shippingState"
                        className={styles.optionInputShipping}
                        type="text"
                        placeholder="State"
                        {...customerRegister('address.state', { required: true })}
                        onKeyUp={() => {
                          setFocusedElementID('submitButton')
                        }}
                        defaultValue={userState !== '' ? userState : undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.cardFormItem}>
                <div className={styles.cardFormItemGroup}>
                  <h1 className={styles.cardFormItemLabel}>SPECIAL INSTRUCTIONS</h1>
                  <div className={styles.checkoutOption}>
                    <textarea
                      id="shippingSpecial"
                      className={styles.specialTextInput}
                      placeholder="Delivery instructions, special requests, etc."
                      {...customerRegister('address.special', { required: false })}
                      defaultValue={userSpecial !== '' ? userSpecial : undefined}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.optionInputShippingWrap}>
                <button
                  className={styles.stripeButton}
                  type="submit"
                  id="submitButton"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CARD FOUR */}
        {showStripeElement && clientSecret && (
          <Elements stripe={stripe} options={options}>
            <CheckoutForm
              stripeSubId={stripeSubId}
              paymentIntentId={paymentIntent}
              {...customerData}
              {...checkoutData}
            />
          </Elements>
        )}
      </div>
    </div>
  )
}
