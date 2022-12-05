'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseClient'
import { collection, getDocs, doc } from 'firebase/firestore'
import styles from '../../styles/ProShop.module.css'
import productImage from '../../public/static/images/membershipImage.jpg'
import Image from 'next/image'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../components/CheckoutForm'

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
}

//@ts-ignore
const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Page() {
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
  const [totalPrice, setTotalPrice] = useState(0)
  const [stage, setStage] = useState(0)
  const [city, setCity] = useState('')

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('')
  const [selectedSubTerm, setSelectedSubTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(0)

  const [showStripeElement, setShowStripeElement] = useState(false)
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads using our local API
    fetch('api/stripe_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalPrice * 100,
        payment_intent_id: '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret), setPaymentIntent(data.id);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
    labels: 'floating',
  };
  const options = {
    clientSecret,
    appearance,
  };

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
  const events = ['Regular 9 Holes', 'Regular 18 Holes', 'Two Man Challenges', 'Majors']
  const playerDev = [
    'Pre-Event Skills Clinic',
    'Skills Asseesment & Tracking',
    'Group Training Events',
  ]

  useEffect(() => {
    const getMembershipOptions = async () => {
      const membershipDoc = await getDocs(membershipRef)
      const onlyDoc = membershipDoc.docs[0]
      const data = onlyDoc.data()
      const DefaultMembership = data['plans'] as defaultMembership
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
    setStage(2)
    console.log(data)
    console.log(totalPrice * 100)
    setShowCheckout(false)
    setShowForm(false)
    setShowStripeElement(true)
  }

  const submitData = async (data: FormData) => {
    console.log(data)
    setCheckoutData(data)
    setShowForm(false)
    setShowCheckout(true)
    const price = () => {
      let tempPrice = 0
      if (data.status === 'new') {
        tempPrice += status.new.price
      }
      if (data.subTerm !== undefined) {
        //@ts-ignore
        tempPrice += membershipOptions[data['plan']][data['term']][data['subTerm']][1]
      } else {
        //@ts-ignore
        tempPrice += membershipOptions[data['plan']][data['term']][1]
      }
      return (tempPrice * data.quantity) / 100
    }
    setTotalPrice(price())
    setStage(1)
  }

  return (
    <div className={styles.contentWrap}>
      <div className={styles.processWrap}>
        <div className={styles.processFlow}>
          <div className={styles.processItemOne}>
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
            <Image src={productImage} alt="TGF Membership" width={100} height={100} />
          </div>
          <h1 className={styles.itemTitle}>TGF MEMBERSHIP</h1>
        </div>

        {showStripeElement && (
        <Elements options={options} stripe={stripe}>
          <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
        )}

        {showCheckout && (
          <div className={styles.typeForm}>
            <div className={styles.typeFormItemSummary}>
              <h1 className={styles.typeFormItemLabel}>TGF MEMBERSHIP SUMMARY</h1>
              <div className={styles.optionWrap}>
                <div className={styles.option}>
                  <button
                    className={styles.backButton}
                    onClick={() => (
                      setShowCheckout(false),
                      setShowForm(true),
                      setCheckoutData({} as FormData),
                      setTotalPrice(0),
                      setCity(''),
                      setStage(0)
                    )}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.typeFormItem}>
              <div className={styles.typeFormItemGroup}>
                <div className={styles.cartGroup}>
                  <h1 className={styles.cartItemTitle}>CITY</h1>
                  <h1 className={styles.cartItemSubTitle}>{checkoutData.city}</h1>
                  <h1 className={styles.cartItemTitle}>PLAN</h1>
                  <h1 className={styles.cartItemSubTitle}> {checkoutData.plan.toUpperCase()}</h1>
                  <h1 className={styles.cartItemTitle}>TERM</h1>
                  <h1 className={styles.cartItemSubTitle}>{checkoutData.term.toUpperCase()}</h1>
                  {checkoutData.subTerm && (
                    <>
                      <h1 className={styles.cartItemTitle}>SUB TERM</h1>
                      <h1 className={styles.cartItemSubTitle}>
                        {checkoutData.subTerm.toUpperCase()}
                      </h1>
                    </>
                  )}
                  <h1 className={styles.cartItemTitle}>STATUS</h1>
                  <h1 className={styles.cartItemSubTitle}>{checkoutData.status.toUpperCase()}</h1>
                  <h1 className={styles.cartItemTitle}>QUANTITY</h1>
                  <h1 className={styles.cartItemSubTitle}>{checkoutData.quantity}</h1>
                  <h1 className={styles.cartItemTitle}>TOTAL</h1>
                  <h1 className={styles.cartItemSubTitle}>${totalPrice}</h1>
                </div>
              </div>
            </div>
            <form onSubmit={customerHandleSubmit(submitCustomerForm)}>
              <div className={styles.typeFormItem}>
                <div className={styles.typeFormItemGroup}>
                  <h1 className={styles.typeFormItemLabel}>CUSTOMER INFORMATION</h1>
                  <div className={styles.optionWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="Email Address"
                        {...customerRegister('email', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="Phone"
                        {...customerRegister('phone', { required: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.typeFormItem}>
                <div className={styles.typeFormItemGroup}>
                  <h1 className={styles.typeFormItemLabel}>SHIPPING ADDRESS (FREE SHIPPING)</h1>
                  <div className={styles.optionWrap}>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="First Name"
                        {...customerRegister('firstName', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="Last Name"
                        {...customerRegister('lastName', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="United States"
                        defaultValue={'United States'}
                        {...customerRegister('address.country', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="Street Address"
                        {...customerRegister('address.street', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="Apt, Unit, Suite, etc (optional)"
                        {...customerRegister('address.opt', { required: false })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="Postal / Zip"
                        {...customerRegister('address.postalCode', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="City"
                        {...customerRegister('address.city', { required: true })}
                      />
                    </div>
                    <div className={styles.checkoutOption}>
                      <input
                        className={styles.typeFormItemInputShipping}
                        type="text"
                        placeholder="State"
                        {...customerRegister('address.state', { required: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.typeFormItem}>
                <div className={styles.typeFormItemGroup}>
                  <h1 className={styles.typeFormItemLabel}>SPECIAL INSTRUCTIONS</h1>
                  <div className={styles.optionWrap}>
                    <textarea
                      className={styles.specialTextInput}
                      placeholder="Special Instructions"
                      {...customerRegister('address.special', { required: false })}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.optionWrap}>
                <button className={styles.stripeButton} type="submit">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit(submitData)} className={styles.typeForm}>
            <div className={styles.typeFormItem}>
              <label className={styles.typeFormItemLabel}>CITY</label>
              <div className={styles.typeFormItemGroup}>
                {cities.map((city) => (
                  <div
                    key={city}
                    className={city === selectedCity ? styles.optionWrapSelect : styles.optionWrap}
                    onClick={() => {
                      setCity(city)
                      setSelectedCity(city)
                    }}
                  >
                    <div className={styles.option}>
                      <input
                        className={styles.typeFormItemInput}
                        type="radio"
                        {...register('city')}
                        value={city}
                        onChange={(e) => {
                          setValue('city', e.target.value)
                          setShowPlan(true)
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
                <div className={styles.typeFormItem}>
                  <label className={styles.typeFormItemLabel}>PLAN</label>
                  <div className={styles.typeFormItemGroup}>
                    {Object.keys(membershipOptions).map((plan) => (
                      <>
                        {(city !== 'San Antonio' && plan === 'performerPlus') ||
                        (city !== 'San Antonio' && plan === 'playerPlus') ? null : (
                          <div
                            key={plan}
                            className={
                              plan === selectedPlan ? styles.optionWrapSelect : styles.optionWrap
                            }
                            onClick={() => {
                              setSelectedPlan(plan)
                            }}
                          >
                            <div className={styles.option}>
                              <input
                                className={styles.typeFormItemInput}
                                type="radio"
                                {...register('plan')}
                                value={plan}
                                onChange={(e) => {
                                  setValue('plan', e.target.value)
                                  setShowTerm(true)
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
                <div className={styles.typeFormItem}>
                  <label className={styles.typeFormItemLabel}>TERM</label>
                  <div className={styles.typeFormItemGroup}>
                    {/* @ts-ignore */}
                    {Object.keys(membershipOptions['performer']).map((term) => (
                      <div
                        key={term}
                        className={
                          term === selectedTerm ? styles.optionWrapSelect : styles.optionWrap
                        }
                        onClick={() => {
                          setSelectedTerm(term)
                        }}
                      >
                        <div className={styles.option}>
                          <input
                            className={styles.typeFormItemInput}
                            type="radio"
                            {...register('term')}
                            value={term}
                            onChange={(e) => {
                              term === 'seasonal'
                                ? setShowSubTerm(true)
                                : (setShowSubTerm(false), setShowQuantity(true))
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
              <div className={styles.typeFormItem}>
                <label className={styles.typeFormItemLabel}>SEASON</label>
                <div className={styles.typeFormItemGroup}>
                  {/* @ts-ignore */}
                  {Object.keys(membershipOptions['performer']['seasonal']).map((subTerm) => (
                    <div
                      key={subTerm}
                      className={
                        subTerm === selectedSubTerm ? styles.optionWrapSelect : styles.optionWrap
                      }
                      onClick={() => {
                        setSelectedSubTerm(subTerm)
                      }}
                    >
                      <div className={styles.option}>
                        <input
                          className={styles.typeFormItemInput}
                          type="radio"
                          {...register('subTerm')}
                          value={subTerm}
                          onChange={(e) => (
                            setShowQuantity(true),
                            setValue('subTerm', e.target.value),
                            setShowStatus(true)
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
              <div className={styles.typeFormItem}>
                <label className={styles.typeFormItemLabel}>QUANTITY</label>
                <div className={styles.typeFormItemGroup}>
                  <div className={styles.optionWrap}>
                    <div className={styles.numberOption}>
                      <input
                        className={styles.typeFormItemInputNumber}
                        type="number"
                        min="1"
                        max="10"
                        defaultValue={1}
                        {...register('quantity')}
                        onChange={(e) => {
                          setValue('quantity', parseInt(e.target.value))
                        }}
                        onInput={(e) => {
                          e.currentTarget.value = Math.max(1, parseInt(e.currentTarget.value))
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
              <div className={styles.typeFormItem}>
                <label className={styles.typeFormItemLabel}>STATUS</label>
                <div className={styles.typeFormItemGroup}>
                  {Object.keys(status).map((statusKey) => (
                    <div
                      key={statusKey}
                      className={
                        statusKey === selectedStatus ? styles.optionWrapSelect : styles.optionWrap
                      }
                      onClick={() => {
                        setSelectedStatus(statusKey)
                      }}
                    >
                      <div className={styles.option}>
                        <input
                          className={styles.typeFormItemInput}
                          type="radio"
                          {...register('status')}
                          value={statusKey}
                          onChange={(e) => (setShowPrice(true), setValue('status', e.target.value))}
                        />
                        <label>{statusKey.toUpperCase()}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showPrice && (
              <div className={styles.typeFormItemGroup}>
                <div className={styles.optionWrap}>
                  <div className={styles.option}>
                    <button className={styles.checkoutButton} type="submit">
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
