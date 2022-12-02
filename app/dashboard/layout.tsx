'use client'

import styles from '../../styles/Dashboard.module.css'
import DashboardNavbar from './DashboardNavbar'
import { StripeProducts } from './StripeProducts'
import auth from '../../firebase/firebaseClient'
import { stripeData } from './StripeProducts'

export default function Layout({ children }: any) {
  return (
    <div>
      <DashboardNavbar />
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.leftcontainer}>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
            <h1>Boring</h1>
          </div>
          <StripeProducts />
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
