'use client'
import styles from './Account.module.css'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebase/firebaseClient'
import {
  collection,
  getDocs,
  getDoc,
  where,
  query,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore'

export const Account = () => {
  const [user] = useAuthState(auth)
  const [purchases, setPurchases] = useState<string[]>([])

  const MyPurchasedEvents = async () => {
    if (!user) return
    const paymentRef = collection(db, 'users', user.uid, 'payments')
    const q = query(paymentRef, where('status', '==', 'succeeded'))

    await getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const prices = doc.data().prices
          prices.forEach((purchase: DocumentReference) => {
            getDoc(purchase)
              .then((doc) => {
                return doc.data()
              })
              .then((data) => {
                setPurchases((prev) => [...prev, data?.product])
              })
              .catch((error) => {
                console.log(error)
              })
          })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    MyPurchasedEvents()
  }, [user])

  return (
    <div className={styles.main}>
      <h1>My Account</h1>
      <h2>My Purchases</h2>
    </div>
  )
}
