'use client'
import styles from '../../styles/ProShop.module.css'
import CheckoutForm from '../../components/stripe/CheckoutForm'
import { auth } from '../../firebase/firebaseClient'
import { db } from '../../firebase/firebaseClient'

import Image from 'next/image'
import productImage from '../../public/static/images/membershipImage.jpg'

import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { collection, getDocs, getDoc, doc, setDoc } from 'firebase/firestore'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export type defaultMembership = {
  plans: {
    performer: {
      annual: {
        title: string
        price: number
      }
      monthly: {
        title: string
        price: number
      }
      primeTime: {
        title: string
        price: number
      }
      seasonal: {
        fall: {
          title: string
          price: number
        }
        spring: {
          title: string
          price: number
        }
        summer: {
          title: string
          price: number
        }
        winter: {
          title: string
          price: number
        }
      }
    }
    performerPlus: {
      annual: {
        title: string
        price: number
      }
      monthly: {
        title: string
        price: number
      }
      primeTime: {
        title: string
        price: number
      }
      seasonal: {
        fall: {
          title: string
          price: number
        }
        spring: {
          title: string
          price: number
        }
        summer: {
          title: string
          price: number
        }
        winter: {
          title: string
          price: number
        }
      }
    }
    player: {
      annual: {
        title: string
        price: number
      }
      monthly: {
        title: string
        price: number
      }
      primeTime: {
        title: string
        price: number
      }
      seasonal: {
        fall: {
          title: string
          price: number
        }
        spring: {
          title: string
          price: number
        }
        summer: {
          title: string
          price: number
        }
        winter: {
          title: string
          price: number
        }
      }
    }
    playerPlus: {
      annual: {
        title: string
        price: number
      }
      monthly: {
        title: string
        price: number
      }
      primeTime: {
        title: string
        price: number
      }
      seasonal: {
        fall: {
          title: string
          price: number
        }
        spring: {
          title: string
          price: number
        }
        summer: {
          title: string
          price: number
        }
        winter: {
          title: string
          price: number
        }
      }
    }
  }
}

type FormData = {
  city: string
  plan: string
  term: string
  subTerm?: string
  status: string
  quantity: number
}

type CustomerData = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: {
    country: string
    street: string
    opt?: string
    postalCode: string
    city: string
    state: string
    special?: string
  }
  amount: number
}

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

export default function Page() {
  const [user] = useAuthState(auth)
  const [membershipOptions, setMembershipOptions] = useState({} as defaultMembership)
  const [showForm, setShowForm] = useState(false)
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

  //handles the user focus on the form
  useEffect(() => {
    const handleNewFocusedElement = () => {
      const focusedElement = document.getElementById(focusedElementID)
      focusedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    handleNewFocusedElement()
  }, [focusedElementID])

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

  useEffect(() => {
    const getMembershipOptions = async () => {
      const membershipDoc = await getDocs(membershipRef)
      const onlyDoc = membershipDoc.docs[0]
      const data = onlyDoc.data()
      const DefaultMembership = data['plans']
      setMembershipOptions(DefaultMembership)
      setShowForm(true)
    }
    getMembershipOptions()
  }, [])

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const {
    register: customerRegister,
    setValue: customerSetValue,
    handleSubmit: customerHandleSubmit,
    formState: { errors: customerErrors },
  } = useForm<CustomerData>()

  const submitCustomerForm = (data: CustomerData) => {
    data.amount = totalPrice * 100
    setCustomerData(data)
    setStage(2)
    setShowForm(false)
    setShowCheckout(false)
    setShowStripeElement(true)
    if (user) {
      console.log('user', user.uid)
      const SetNewData = async (data: CustomerData) => {
        const memberDocRef = doc(db, 'users', user.uid)
        const memberDoc = await getDoc(memberDocRef)
        const memberData = memberDoc.data()
        if (memberData) {
          setDoc(memberDocRef, {
            ...memberData,
            address: data.address,
            phone: data.phone,
          })
        }
      }
      SetNewData(data)
    }
  }

  const submitData = async (data: FormData) => {
    setCheckoutData(data)
    setShowForm(false)
    setShowCheckout(true)
    setIntervalPurchase('')

    const getMembershipPrice = async (season: boolean) => {
      const membershipDoc = await getDocs(membershipRef)
      const onlyDoc = membershipDoc.docs[0]

      if (season) {
        //@ts-ignore
        const seasonal = data.subTerm.toString().toLowerCase()
        return onlyDoc.data().plans[data.plan][data.term][seasonal]
      } else {
        return onlyDoc.data().plans[data.plan][data.term]
      }
    }

    let tempPrice = 0
    if (data.status === 'new') {
      tempPrice += status.new.price
    }
    if (data.term.toLowerCase() === 'seasonal') {
      const price = await getMembershipPrice(true)

      tempPrice += price[1]
      setLineItemPrice(price[1])
    } else {
      const price = await getMembershipPrice(false)
      tempPrice += price[1]
      setLineItemPrice(price[1])
    }

    setTotalPrice((tempPrice * data.quantity) / 100)

    if (selectedTerm.toLowerCase() === 'annual') {
      setIntervalPurchase('year')
    } else {
      setIntervalPurchase('month')
    }
    setStage(1)
  }

  useEffect(() => {
    if (user && intervalPurchase !== '') {
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
        uid: user.uid,
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

  useEffect(() => {
    if (user) {
      const memberDocRef = doc(db, 'users', user.uid)
      const getMemberData = async () => {
        const memberDoc = await getDoc(memberDocRef)
        if (memberDoc.exists()) {
          const memberData = memberDoc.data()

          if (memberData?.firstName) {
            setUserFirstName(memberData.googleAccountFirstName)
          }
          if (memberData?.googleAccountLastName) {
            setUserLastName(memberData.googleAccountLastName)
          }
          if (memberData?.email) {
            setUserEmail(memberData.email)
          }
          if (memberData?.phone) {
            setUserPhone(memberData.phone)
          }
          if (memberData?.address?.city) {
            setUserCity(memberData.address.city)
          }
          if (memberData?.address?.postal) {
            setUserPostal(memberData.address.postal)
          }
          if (memberData?.address?.state) {
            setUserState(memberData.address.state)
          }
          if (memberData?.address?.street) {
            setUserStreet(memberData.address.street)
          }
          if (memberData?.address?.opt) {
            setUserStreetTwo(memberData.address.opt)
          }
          if (memberData?.address?.special) {
            setUserSpecial(memberData.address.special)
          }
        }
      }
      getMemberData()
    }
  }, [showForm])

  return (
    <div className={styles.contentWrap}>
      <div className={styles.processWrap}>
        <div className={styles.processFlow}>
          <div className={styles.processItemOne}>
            {/* PROGRESS BAR */}
            {stage >= 0 ? (
              <div className={styles.borderCircle}>
                <div>
                  <h2 className={styles.processNumber}>1</h2>
                </div>
                <h1 className={styles.processTitle}>Membership Type</h1>
              </div>
            ) : (
              <div className={styles.borderCircle} style={{ opacity: 0.2 }}>
                <div>
                  <h2 className={styles.processNumber}>1</h2>
                </div>
                <h1 className={styles.processTitle}>Membership Type</h1>
              </div>
            )}
          </div>
          <div className={styles.lineBetweenDiv12}></div>
          <div className={styles.processItemTwo}>
            {stage > 0 ? (
              <div className={styles.borderCircle}>
                <div>
                  <h2 className={styles.processNumber}>2</h2>
                </div>
                <h1 className={styles.processTitle}>Customer Info.</h1>
              </div>
            ) : (
              <div className={styles.borderCircle} style={{ opacity: 0.2 }}>
                <div>
                  <h2 className={styles.processNumber}>2</h2>
                </div>
                <h1 className={styles.processTitle}>Customer Info.</h1>
              </div>
            )}
          </div>
          <div className={styles.lineBetweenDiv23}></div>
          <div className={styles.processItemThree}>
            {stage > 1 ? (
              <div className={styles.borderCircle}>
                <div>
                  <h2 className={styles.processNumber}>3</h2>
                </div>
                <h1 className={styles.processTitle}>Checkout</h1>
              </div>
            ) : (
              <div className={styles.borderCircle} style={{ opacity: 0.2 }}>
                <div>
                  <h2 className={styles.processNumber}>3</h2>
                </div>
                <h1 className={styles.processTitle}>Checkout</h1>
              </div>
            )}
          </div>
        </div>
      </div>

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

        {/* CARD THREE */}
        {showStripeElement && clientSecret && (
          <Elements stripe={stripe} options={options}>
            <CheckoutForm paymentIntent={paymentIntent} {...customerData} />
          </Elements>
        )}

        {/* CARD TWO */}
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
                      setShowForm(true),
                      setCheckoutData({} as FormData),
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
                      setShowPrice(false)
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
                        placeholder="Phone"
                        {...customerRegister('phone', {
                          required: true,
                        })}
                        onKeyUp={() => {
                          setFocusedElementID('shippingFirst')
                        }}
                        defaultValue={userPhone !== '' ? userPhone : undefined}
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

        {/* CARD ONE */}
        {showForm && (
          <form onSubmit={handleSubmit(submitData)} className={styles.cardForm}>
            <div className={styles.cardFormItem}>
              <label className={styles.cardFormItemLabel}>CITY</label>
              <div className={styles.cardFormItemGroup} id="cities">
                {cities.map((city) => (
                  <div
                    key={city}
                    className={
                      city === selectedCity
                        ? styles.cardFormOptionWrapSelect
                        : styles.cardFormOptionWrap
                    }
                    onClick={() => {
                      setCity(city)
                      setSelectedCity(city)
                    }}
                  >
                    <div className={styles.option}>
                      <input
                        className={styles.optionInput}
                        type="radio"
                        {...register('city')}
                        value={city}
                        onChange={(e) => {
                          setValue('city', e.target.value)
                          setShowPlan(true)
                          setFocusedElementID('plans')
                        }}
                      />
                      <label>{city.toUpperCase()}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {showPlan && (
                <div className={styles.cardFormItem}>
                  <label className={styles.cardFormItemLabel}>PLAN</label>
                  <div className={styles.cardFormItemGroup} id="plans">
                    {Object.keys(membershipOptions).map((plan) => (
                      <>
                        {(city !== 'San Antonio' && plan === 'performerPlus') ||
                        (city !== 'San Antonio' && plan === 'playerPlus') ? null : (
                          <div
                            key={plan}
                            className={
                              plan === selectedPlan
                                ? styles.cardFormOptionWrapSelect
                                : styles.cardFormOptionWrap
                            }
                            onClick={() => {
                              setSelectedPlan(plan)
                            }}
                          >
                            <div className={styles.option}>
                              <input
                                className={styles.optionInput}
                                type="radio"
                                {...register('plan')}
                                value={plan}
                                onChange={(e) => {
                                  setValue('plan', e.target.value)
                                  setShowTerm(true)
                                  setFocusedElementID('terms')
                                }}
                              />
                              <label>{plan.toUpperCase()}</label>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              {showTerm && (
                <div className={styles.cardFormItem}>
                  <label className={styles.cardFormItemLabel}>TERM</label>
                  <div className={styles.cardFormItemGroup} id="terms">
                    {Object.keys(
                      /* @ts-ignore */
                      membershipOptions['performer']
                    ).map((term) => (
                      <div
                        key={term}
                        className={
                          term === selectedTerm
                            ? styles.cardFormOptionWrapSelect
                            : styles.cardFormOptionWrap
                        }
                        onClick={() => {
                          setSelectedTerm(term)
                        }}
                      >
                        <div className={styles.option}>
                          <input
                            className={styles.optionInput}
                            type="radio"
                            {...register('term')}
                            value={term}
                            onChange={(e) => {
                              term === 'seasonal'
                                ? (setShowSubTerm(true),
                                  setFocusedElementID('seasons'))
                                : (setShowSubTerm(false),
                                  setShowQuantity(true),
                                  setFocusedElementID('quantity'))
                              setValue('term', e.target.value), setShowStatus(true)
                            }}
                          />
                          <label>{term.toUpperCase()}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {showSubTerm && (
              <div className={styles.cardFormItem} id="seasons">
                <label className={styles.cardFormItemLabel}>SEASON</label>
                <div className={styles.cardFormItemGroup}>
                  {Object.keys(
                    /* @ts-ignore */
                    membershipOptions['performer']['seasonal']
                  ).map((subTerm) => (
                    <div
                      key={subTerm}
                      className={
                        subTerm === selectedSubTerm
                          ? styles.cardFormOptionWrapSelect
                          : styles.cardFormOptionWrap
                      }
                      onClick={() => {
                        setSelectedSubTerm(subTerm)
                      }}
                    >
                      <div className={styles.option}>
                        <input
                          className={styles.optionInput}
                          type="radio"
                          {...register('subTerm')}
                          value={subTerm}
                          onChange={(e) => (
                            setShowQuantity(true),
                            setValue('subTerm', e.target.value),
                            setShowStatus(true),
                            setFocusedElementID('quantity')
                          )}
                        />
                        <label>{subTerm.toUpperCase()}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showQuantity && (
              <div className={styles.cardFormItem} id="quantity">
                <label className={styles.cardFormItemLabel}>QUANTITY</label>
                <div className={styles.cardFormItemGroup}>
                  <div className={styles.cardFormOptionWrap}>
                    <div className={styles.numberOption}>
                      <input
                        className={styles.optionInputNumber}
                        type="number"
                        min="1"
                        max="10"
                        defaultValue={1}
                        {...register('quantity')}
                        onChange={(e) => {
                          setValue('quantity', parseInt(e.target.value))
                        }}
                        onInput={(e) => {
                          e.currentTarget.value = Math.max(
                            1,
                            parseInt(e.currentTarget.value)
                          )
                            .toString()
                            .slice(0, 1)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showStatus && (
              <div className={styles.cardFormItem} id="status">
                <label className={styles.cardFormItemLabel}>STATUS</label>
                <div className={styles.cardFormItemGroup}>
                  {Object.keys(status).map((statusKey) => (
                    <div
                      key={statusKey}
                      className={
                        statusKey === selectedStatus
                          ? styles.cardFormOptionWrapSelect
                          : styles.cardFormOptionWrap
                      }
                      onClick={() => {
                        setSelectedStatus(statusKey)
                        setFocusedElementID('checkoutButton')
                      }}
                    >
                      <div className={styles.option}>
                        <input
                          className={styles.optionInput}
                          type="radio"
                          {...register('status')}
                          value={statusKey}
                          onChange={(e) => (
                            setShowPrice(true), setValue('status', e.target.value)
                          )}
                        />
                        <label>{statusKey.toUpperCase()}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showPrice && (
              <div className={styles.cardFormItemGroup}>
                <div className={styles.cardFormOptionWrap}>
                  <div className={styles.option} id="checkoutButton">
                    <button
                      className={styles.checkoutButton}
                      type="submit"
                      onClick={() => {
                        setFocusedElementID('top')
                      }}
                    >
                      CHECKOUT
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
