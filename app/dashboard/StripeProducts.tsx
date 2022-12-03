'use client'

import { db } from '../../firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import styles from '../../styles/Dashboard.module.css'
import checkoutSession from '../../stripe/checkoutSession'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'

export type stripeData = {
  name: string
  price: number
  productId: string
}

export const StripeProducts = () => {
  const [user] = useAuthState(auth)
  const [data, setData] = useState<stripeData[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<stripeData[]>([])

  useEffect(() => {
    const getStripeData = async () => {
      const colRef = collection(db, 'products')
      const querySnapshot = await getDocs(colRef)
      querySnapshot.forEach(async (doc) => {
        const priceRef = collection(db, 'products', doc.id, 'prices')
        const subDocs = await getDocs(priceRef)
        const prices = subDocs.docs.map((doc) => doc.data())
        const ids = subDocs.docs.map((doc) => doc.id)
        const price = prices[0].unit_amount / 100
        const name = doc.data().name
        const productId = ids[0]
        setData((prev) => [
          ...prev,
          {
            name: name,
            price: price,
            productId: productId,
          },
        ])
      })
    }
    getStripeData()
    setLoading(false)
  }, [])

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.rightRow}>
            <div className={styles.cart}>
              <h1 className={styles.cartTitle}>Cart</h1>
              {cart.map((item, index) => (
                <div key={index} className={styles.cartContainer}>
                  <h1 className={styles.cartItemName}>{item.name}</h1>
                  <h1 className={styles.cartItemPrice}>${item.price}.00</h1>
                </div>
              ))}
              <div className={styles.cartTotal}>
                <h1 className={styles.cartTotalTitle}>Total: </h1>
                <h1 className={styles.cartTotalPrice}>
                  $
                  {cart.reduce((acc, item) => {
                    return acc + item.price
                  }, 0)}
                  .00
                </h1>
                <button
                  className={styles.cartCheckout}
                  onClick={() => {
                    user
                      ? checkoutSession(
                          user?.uid,
                          cart.map((item) => item.productId),
                          cart.map((item) => item.name)
                        )
                      : alert('Authentication Error')
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
            <div className={styles.rightcontainer}>
              {data.map((item, index) => (
                <div key={index} className={styles.rightcard}>
                  <h1>{item.name}</h1>
                  <h2>${item.price}.00</h2>
                  {/* @ts-ignore */}
                  <button
                    className={styles.button}
                    key={index}
                    onClick={() => {
                      setCart((prev) => [...prev, item])
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
