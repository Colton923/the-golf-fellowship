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
  const [totalSales, setTotalSales] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [totalSubtotal, setTotalSubtotal] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      let total = 0
      let tax = 0
      let subtotal = 0
      data.forEach((item) => {
        item.orderTotal
          ? (total += parseInt(item.orderTotal.replace('$', '').replace(',', '')))
          : (total += 0)
        item.salesTax
          ? (tax += parseInt(item.salesTax.replace('$', '').replace(',', '')))
          : (tax += 0)
        item.subTotal
          ? (subtotal += parseInt(item.subTotal.replace('$', '').replace(',', '')))
          : (subtotal += 0)
      })
      setTotalSales(total)
      setTotalTax(tax)
      setTotalSubtotal(subtotal)
    }
  }, [data])

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
            <div className={styles.gridLayout}>
              <div className={styles.gridHeaders}>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}></h1>
                <h1 className={styles.itemHeader}>{totalSubtotal}</h1>
                <h1 className={styles.itemHeader}>{totalTax}</h1>
                <h1 className={styles.itemHeader}>{totalSales}</h1>
              </div>
              <div className={styles.gridHeaders}>
                <h1 className={styles.itemHeader}>Date</h1>
                <h1 className={styles.itemHeader}>Name</h1>
                <h1 className={styles.itemHeader}>City</h1>
                <h1 className={styles.itemHeader}>Club</h1>
                <h1 className={styles.itemHeader}>Plan</h1>
                <h1 className={styles.itemHeader}>Term</h1>
                <h1 className={styles.itemHeader}>Status</h1>
                <h1 className={styles.itemHeader}>SKU</h1>
                <h1 className={styles.itemHeader}>Subtotal</h1>
                <h1 className={styles.itemHeader}>Sales Tax</h1>
                <h1 className={styles.itemHeader}>Order Total</h1>
              </div>
              {data.map((item, index) => (
                <div className={styles.gridData} key={index}>
                  <h1 className={styles.itemLabel}>{item.date ? item.date : ''}</h1>
                  <h1 className={styles.itemLabel}>{item.name ? item.name : ''}</h1>
                  <h1 className={styles.itemLabel}>{item.city ? item.city : ''}</h1>
                  <h1 className={styles.itemLabel}>{item.club ? item.club : ''}</h1>
                  <h1 className={styles.itemLabel}>{item.plan ? item.plan : ''}</h1>
                  <h1 className={styles.itemLabel}>{item.term ? item.term : ''}</h1>
                  <h1 className={styles.itemLabel}>
                    {item.status ? item.status : ''}
                  </h1>

                  <h1 className={styles.itemLabel}>{item.sku ? item.sku : ''}</h1>

                  <h1 className={styles.itemLabel}>
                    {item.subTotal ? item.subTotal : ''}
                  </h1>

                  <h1 className={styles.itemLabel}>
                    {item.salesTax ? item.salesTax : ''}
                  </h1>

                  <h1 className={styles.itemLabel}>
                    {item.orderTotal ? item.orderTotal : ''}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
