'use client'

import { db } from '../../../../firebase/firebaseClient'
import { collection, getDocs, where, query } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import checkoutSession from '../../../../stripe/checkoutSession'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../../firebase/firebaseClient'
import styles from './Events.module.css'

export type stripeData = {
  name: string
  price: number
  productId: string
  description: string
}

export const Events = () => {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<stripeData[]>([])
  const [cartVisible, setCartVisible] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [items, setItems] = useState<JSX.Element[]>([])

  const toggleCart = () => {
    setCartVisible(!cartVisible)
  }

  const rockTheBoat = () => {
    const svg = document.getElementById('rockTheBoat')
    svg?.animate(
      [
        { transform: 'scale(1.6)' },
        { transform: 'scale(1)' },
        { transform: 'scale(1.5)' },
        { transform: 'scale(1)' },
      ],
      {
        duration: 400,
        iterations: 1,
      }
    )
    if (navigator.vibrate) {
      // vibrate for 500ms
      navigator.vibrate(500)
    }
  }

  useEffect(() => {
    const getStripeData = async () => {
      const colRef = collection(db, 'products')
      const q = query(colRef, where('metadata.eventType', '!=', null))
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          setLoading(true)
          const priceRef = collection(db, 'products', doc.id, 'prices')
          await getDocs(priceRef)
            .then((subDocs) => {
              const prices = subDocs.docs.map((doc) => doc.data())
              const ids = subDocs.docs.map((doc) => doc.id)
              const price = prices[0].unit_amount / 100
              const name = doc.data().name
              const productId = ids[0]
              const description = doc.data().description
              const data = { name, price, productId, description }

              setItems((items) => {
                return [
                  ...items,
                  <div key={productId} className={styles.item}>
                    <h1 className={styles.itemHeader}>{name}</h1>
                    <h1 className={styles.itemPrice}>${price}.00</h1>
                    <p className={styles.itemDescription}>{description}</p>
                    <input
                      type={'button'}
                      className={styles.itemButton}
                      onClick={() => {
                        setCart((cart) => [...cart, data])
                        rockTheBoat()
                      }}
                      value={'Add to Cart'}
                    />
                  </div>,
                ]
              })
            })
            .then(() => {
              setLoading(false)
            })
        })
      })
    }
    getStripeData()
  }, [])

  useEffect(() => {
    if (checkingOut) {
      rockTheBoat()
    }
  }, [checkingOut])

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <div className={styles.main}>
        <div
          className={
            cartVisible ? styles.checkoutWrapper : styles.checkoutWrapperCollapsed
          }
        >
          <div className={cartVisible ? styles.chevronRotate : styles.chevron}>
            <svg
              id="rockTheBoat"
              onClick={toggleCart}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
              />
            </svg>
          </div>
          {cartVisible ? (
            <div className={styles.cart}>
              {cart.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <h1 className={styles.cartItemHeader}>{item.name}</h1>
                  <h1 className={styles.cartItemPrice}>${item.price}.00</h1>

                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className={styles.cartItemButton}
                    onClick={() => {
                      const newCart = cart.filter((cartItem) => {
                        return cartItem.productId !== item.productId
                      })
                      setCart(newCart)
                    }}
                  >
                    {/* "X" svg */}
                    <path
                      fill="currentColor"
                      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                    />
                  </svg>
                </div>
              ))}

              <div className={styles.checkout}>
                <h1 className={styles.header}>Total: </h1>
                <h1 className={styles.header}>
                  $
                  {cart.reduce((acc, item) => {
                    return acc + item.price
                  }, 0)}
                  .00
                </h1>
                <input
                  type={'button'}
                  className={styles.checkoutButton}
                  onClick={() => {
                    user && !checkingOut
                      ? (checkoutSession(
                          user?.uid,
                          cart.map((item) => item.productId),
                          cart.map((item) => item.name)
                        ),
                        setCheckingOut(true))
                      : alert('Authentication Error')
                  }}
                  value={'Checkout'}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.items}>
          <div className={styles.itemsWrapper}>{items}</div>
        </div>
      </div>
    </>
  )
}
