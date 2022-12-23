'use client'
import Image from 'next/image'
import imgBackground from '../../public/static/images/tgf_dashboard_background.png'
import styles from '../../styles/Testpage.module.css'
import AdminNavbar from '../../components/AdminNavbar'
import { useEffect } from 'react'
import { Calendar } from '../../components/calendar/Calendar'

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
          <div className={styles.calendarWrapper}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  )
}
