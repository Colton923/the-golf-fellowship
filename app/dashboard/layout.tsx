'use client'

import styles from '../../styles/Dashboard.module.css'
import DashboardNavbar from '../admin/AdminNavbar'
import { StripeProducts } from './StripeProducts'
import { MySubscriptions } from './MySubscriptions'
import { auth } from '../../firebase/firebaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Layout({ children }: any) {
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (auth.currentUser) {
      setLoggedIn(true)
    } else {
      router.push('/')
    }
  }, [])

  if (!loggedIn) {
    return <div></div>
  }

  return (
    <div>
      <DashboardNavbar />
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.leftcontainer}>
            <MySubscriptions />
          </div>
          <StripeProducts />
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
