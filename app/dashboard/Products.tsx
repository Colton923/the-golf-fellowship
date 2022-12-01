'use client'

import stripeProducts from '../../stripe/stripeProducts'
import { useState, useEffect } from 'react'
import styles from '../../styles/Dashboard.module.css'

export type stripeData = {
  key: string
  name: string
  price: number
}

export default function Products() {
  const [stripeData, setStripeData] = useState<stripeData[]>([])

  useEffect(() => {
    const getStripeData = async () => {
      const data = await stripeProducts()
      setStripeData(data)
    }
    getStripeData()
  }, [stripeData])

  return (
    <div>
      {stripeData.slice(0, -1).map((item) => (
        <div className={styles.rightcard} key={item.key}>
          <h1>{item.name}</h1>
          <h2>${item.price}</h2>
        </div>
      ))}
      {stripeData.slice(-1).map((item) => (
        <div className={styles.rightcard} key={item.key}>
          <h1>{item.name}</h1>
          <h2>${item.price}</h2>
        </div>
      ))}
    </div>
  )
}
