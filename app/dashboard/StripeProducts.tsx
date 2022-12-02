'use client'

import { db } from '../../firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import styles from '../../styles/Dashboard.module.css'
import { render } from 'react-dom'

export type stripeData = {
  name: string
  price: number
}

export const StripeProducts = () => {
  const [data, setData] = useState<stripeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStripeData = async () => {
      const colRef = collection(db, 'products')
      const querySnapshot = await getDocs(colRef)
      querySnapshot.forEach(async (doc) => {
        const priceRef = collection(db, 'products', doc.id, 'prices')
        const subDocs = await getDocs(priceRef)
        const prices = subDocs.docs.map((doc) => doc.data())
        const price = prices[0].unit_amount
        const name = doc.data().name
        setData((prev) => [
          ...prev,
          {
            name: name,
            price: price,
          },
        ])
      })
    }
    getStripeData()
    setLoading(false)
  }, [])

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data.map((item, index) => (
            <div key={index} className={styles.rightcard}>
              <h1>{item.name}</h1>
              <h2>${item.price}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
