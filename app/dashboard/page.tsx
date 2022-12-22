'use client'
import Image from 'next/image'
import imgBackground from '../../public/static/images/tgf_dashboard_background.png'
import styles from '../../styles/Dashboard_new.module.css'
import AdminNavbar from '../../components/AdminNavbar'
import { useEffect } from 'react'

export default function Page() {
  return (
    <div className={styles.dashboardWrapper}>
      <AdminNavbar />
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage}>
          <Image src={imgBackground} alt="Background image" quality={100} fill />
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.events}>Events</div>
          <div className={styles.stats}>Statistics</div>
          <div className={styles.account}>My Account</div>
        </div>
      </div>
    </div>
  )
}
