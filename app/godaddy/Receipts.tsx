'use client'

import { db } from '../../firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import styles from '../../styles/GoDaddy.module.css'
import type { Order } from '../../types/order'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'

export const Receipts = () => {
  const [data, setData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      console.log(user)
      const getOrdersFromFirebase = async () => {
        const colRef = collection(db, 'goDaddy')
        const querySnapshot = await getDocs(colRef)
        querySnapshot.forEach(async (doc) => {
          const receipt = doc.data() as Order

          setData((prev) => [...prev, receipt])
        })
      }
      getOrdersFromFirebase()
      setLoading(false)
    }
  }, [user])

  return (
    <>
      {loading || data.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.main}>
            <div className={styles.cardGrid}>
              {data.map((item, index) => (
                <div key={index} className={styles.card}>
                  <div className={styles.cardLeftColumn}>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Name</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Email</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Phone</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Order Number</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Order Date</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Shipping Address</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Billing Address</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>City</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Plan</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Term</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Status</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>SKU</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Sub Total</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Shipping + Tax</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Sales Tax</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>Order Total</h1>
                    </div>
                  </div>
                  <div className={styles.cardRightColumn}>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.name}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.email}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.phone}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.orderNumber}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.orderDate}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.shippingAddress}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.billingAddress}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.city}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.plan}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.term}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.status}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.sku}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.subTotal}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>
                        {item.order.shippingPlusTax}
                      </h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.salesTax}</h1>
                    </div>
                    <div className={styles.cardTextWrapper}>
                      <h1 className={styles.cardText}>{item.order.orderTotal}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
