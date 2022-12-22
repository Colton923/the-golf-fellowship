'use client'

import { db } from '../../firebase/firebaseClient'
import { collection, getDocs, doc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import styles from '../../styles/Dashboard.module.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'

export type subData = {
  name: string
  expiration: string
}

export const MySubscriptions = () => {
  const [user] = useAuthState(auth)
  const [data, setData] = useState<subData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStripeData = async () => {
      const colRef = collection(db, 'users')
      if (user) {
        const userDoc = doc(colRef, user.uid)
        const subRef = collection(userDoc, 'subscriptions')
        const querySnapshot = await getDocs(subRef)
        if (querySnapshot.empty) {
          setData([])
          setLoading(false)
        } else {
          querySnapshot.forEach((item) => {
            if (item.data().status === 'active') {
              item.data().items?.forEach((element: any) => {
                const name = element.price.product.name
                const expiration = item.data().current_period_end.seconds

                setData((prev) => [
                  ...prev,
                  {
                    name: name,
                    expiration: expiration,
                  },
                ])
              })
              setLoading(false)
            }
          })
        }
      }
    }
    getStripeData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <div className={styles.subscriptions}>
          <div className={styles.subscriptionWrapper}>
            <h1 className={styles.subscriptionTitle}>My Subscriptions</h1>
            {data.length === 0 ? (
              <div className={styles.subscriptionSubTitle}>You have no active subscriptions.</div>
            ) : (
              <>
                {data.map((item, index) => (
                  <div key={index} className={styles.subscriptionGroup}>
                    <h1 className={styles.subscriptionName}>{item.name}</h1>
                    <h1 className={styles.subscriptionDate}>Expires: {item.expiration}</h1>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    )
  }
}
