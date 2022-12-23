'use client'
import Image from 'next/image'
import imgBackground from '../../public/static/images/tgf_dashboard_background.png'
import styles from '../../styles/Dashboard_new.module.css'
import AdminNavbar from '../../components/AdminNavbar'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Page() {
  const [events, setEvents] = useState(false)
  const [stats, setStats] = useState(false)
  const [account, setAccount] = useState(false)
  const [calendar, setCalendar] = useState(false)
  const [placeholder, setPlaceholder] = useState(false)

  // Handlers for opening the cards on click
  const handleEventsClick = () => {
    if (events) {
      setEvents(false)
    } else {
      setEvents(true)
    }
  }

  const handleStatsClick = () => {
    if (stats) {
      setStats(false)
    } else {
      setStats(true)
    }
  }

  const handleAccountClick = () => {
    if (account) {
      setAccount(false)
    } else {
      setAccount(true)
    }
  }

  const handleCalendarClick = () => {
    if (calendar) {
      setCalendar(false)
    } else {
      setCalendar(true)
    }
  }

  const handlePlaceholderClick = () => {
    if (placeholder) {
      setPlaceholder(false)
    } else {
      setPlaceholder(true)
    }
  }

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
          <div className={styles.buttonsWrapper}>
            <div className={styles.events} onClick={handleEventsClick}>
              Events
            </div>
            <div className={styles.stats} onClick={handleStatsClick}>
              Statistics
            </div>
            <div className={styles.account} onClick={handleAccountClick}>
              My Account
            </div>
            <div className={styles.account} onClick={handleCalendarClick}>
              Calendar
            </div>
            <div className={styles.account} onClick={handlePlaceholderClick}>
              Placeholder
            </div>
          </div>
          <div className={styles.cardsWrapper}>
            <div className={events ? styles.eventsCard : styles.hidden}>
              events card
            </div>
            <div className={stats ? styles.statsCard : styles.hidden}>
              stats card
            </div>
            <div className={account ? styles.accountCard : styles.hidden}>
              account card
            </div>
            <div className={calendar ? styles.calendarCard : styles.hidden}>
              calendar card
            </div>
            <div className={placeholder ? styles.placeholderCard : styles.hidden}>
              placeholder card
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
