'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebaseClient'
import { collection, getDocs, doc } from 'firebase/firestore'

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
    console.log(totalPrice)
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
    <div>
      <h1>TGF MEMBERSHIP</h1>
      <div>
        <div>
          {stage === 0 ? (
            <div>
              <h2>1</h2>
            </div>
          ) : (
            <div>
              <h2>1</h2>
            </div>
          )}
          <h1>Membership Type</h1>
        </div>
        <div>
          {stage > 0 ? (
            <div>
              <h2>2</h2>
            </div>
          ) : (
            <div>
              <h2>2</h2>
            </div>
          )}
          <h1>Customer Info.</h1>
        </div>
        <div>
          {stage > 1 ? (
            <div>
              <h2>3</h2>
            </div>
          ) : (
            <div>
              <h2>3</h2>
            </div>
          )}
          <h1>Membership Type</h1>
        </div>
      </div>
      {showCheckout && (
        <div>
          <button
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
          <div>
            <div>
              <h1>TGF MEMBERSHIP SUMMARY</h1>
              <h1>PRICE</h1>
              <h2>QUANTITY</h2>
              <h3>TOTAL</h3>
            </div>
            <div>
              <div>
                <h1>CITY: {checkoutData.city}</h1>
                <h1>PLAN: {checkoutData.plan}</h1>
                <h1>TERM: {checkoutData.term}</h1>
                {checkoutData.subTerm && <h1>SUB TERM: {checkoutData.subTerm}</h1>}
                <h1>STATUS: {checkoutData.status}</h1>
              </div>
              <div>
                <h1>${totalPrice}.00</h1>
              </div>
              <div>
                <h1>{checkoutData.quantity} X</h1>
              </div>
              <div>
                <h1>${totalPrice * checkoutData.quantity}.00</h1>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={customerHandleSubmit(submitCustomerForm)}>
              <div>
                <h1>CUSTOMER INFORMATION</h1>
                <input
                  type="text"
                  placeholder="Email Address"
                  {...customerRegister('email', { required: true })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  {...customerRegister('phone', { required: true })}
                />
              </div>
              <div>
                <h1>SHIPPING ADDRESS</h1>
                <input
                  type="text"
                  placeholder="First Name"
                  {...customerRegister('firstName', { required: true })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  {...customerRegister('lastName', { required: true })}
                />
                <input
                  type="text"
                  placeholder="United States"
                  defaultValue={'United States'}
                  {...customerRegister('address.country', { required: true })}
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  {...customerRegister('address.street', { required: true })}
                />
                <input
                  type="text"
                  placeholder="Apt, Unit, Suite, etc (optional)"
                  {...customerRegister('address.opt', { required: false })}
                />

                <input
                  type="text"
                  placeholder="Postal / Zip"
                  {...customerRegister('address.postalCode', { required: true })}
                />
                <input
                  type="text"
                  placeholder="City"
                  {...customerRegister('address.city', { required: true })}
                />
                <input
                  type="text"
                  placeholder="State"
                  {...customerRegister('address.state', { required: true })}
                />
              </div>
              <div>
                <h1>SHIPPING</h1>
                <h2>FREE</h2>
              </div>
              <div>
                <h1>SPECIAL INSTRUCTIONS</h1>
                <input
                  type="text"
                  placeholder="Special Instructions"
                  {...customerRegister('address.special', { required: false })}
                />
              </div>
              <button type="submit">SUBMIT</button>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit(submitData)}>
          <div>
            <label>CITY</label>
            {cities.map((city) => (
              <div key={city}>
                <input
                  type="radio"
                  {...register('city')}
                  value={city}
                  onChange={(e) => {
                    setValue('city', e.target.value)
                    setShowPlan(true)
                    setCity(e.target.value)
                  }}
                />
                <label>{city.toUpperCase()}</label>
              </div>
            ))}
          </div>
          <div>
            {showPlan && (
              <div>
                <label>PLAN</label>
                {Object.keys(membershipOptions).map((plan) => (
                  <div key={plan}>
                    {(city !== 'San Antonio' && plan === 'performerPlus') ||
                    (city !== 'San Antonio' && plan === 'playerPlus') ? null : (
                      <>
                        <input
                          type="radio"
                          {...register('plan')}
                          value={plan}
                          onChange={(e) => {
                            setValue('plan', e.target.value)
                            setShowTerm(true)
                          }}
                        />
                        <label>{plan.toUpperCase()}</label>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {showTerm && (
              <div>
                <label>TERM</label>
                {/* @ts-ignore */}
                {Object.keys(membershipOptions['performer']).map((term) => (
                  <div key={term}>
                    <input
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
                ))}
              </div>
            )}
          </div>
          {showSubTerm && (
            <div>
              <label>SEASON</label>
              {/* @ts-ignore */}
              {Object.keys(membershipOptions['performer']['seasonal']).map((subTerm) => (
                <div key={subTerm}>
                  <input
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
              ))}
            </div>
          )}
          {showQuantity && (
            <div>
              <label>QUANTITY</label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue={1}
                {...register('quantity')}
                onChange={(e) => {
                  setValue('quantity', parseInt(e.target.value))
                }}
              />
            </div>
          )}
          {showStatus && (
            <div>
              <label>STATUS</label>
              {Object.keys(status).map((statusKey) => (
                <div key={statusKey}>
                  <input
                    type="radio"
                    {...register('status')}
                    value={statusKey}
                    onChange={(e) => (setShowPrice(true), setValue('status', e.target.value))}
                  />
                  <label>{statusKey.toUpperCase()}</label>
                </div>
              ))}
            </div>
          )}
          {showPrice && (
            <div>
              <button type="submit">CHECKOUT</button>
            </div>
          )}
        </form>
      )}
    </div>
  )
}
