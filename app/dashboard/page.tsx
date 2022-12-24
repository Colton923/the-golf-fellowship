'use client'
import Image from 'next/image'
import imgBackground from '../../public/static/images/tgf_dashboard_background.png'
import styles from '../../styles/Dashboard_new.module.css'

import { useEffect } from 'react'
import { useState } from 'react'
import { Calendar } from '../../components/calendar/Calendar'

export default function Page() {
  const [events, setEvents] = useState(false)
  const [stats, setStats] = useState(false)
  const [account, setAccount] = useState(false)
  const [calendar, setCalendar] = useState(false)
  const [placeholder, setPlaceholder] = useState(false)
  const [screenWidth, setScreenWidth] = useState(365)

  useEffect(() => {
    const handleScreenResize = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleScreenResize)
    return () => window.removeEventListener('resize', handleScreenResize)
  }, [])

  const hideAllButOne = (one: string) => {
    if (one === 'events') {
      setStats(false)
      setAccount(false)
      setCalendar(false)
      setPlaceholder(false)
      setEvents(true)
    } else if (one === 'stats') {
      setEvents(false)
      setAccount(false)
      setCalendar(false)
      setPlaceholder(false)
      setStats(true)
    } else if (one === 'account') {
      setEvents(false)
      setStats(false)
      setCalendar(false)
      setPlaceholder(false)
      setAccount(true)
    } else if (one === 'calendar') {
      setEvents(false)
      setStats(false)
      setAccount(false)
      setPlaceholder(false)
      setCalendar(true)
    } else if (one === 'placeholder') {
      setEvents(false)
      setStats(false)
      setAccount(false)
      setCalendar(false)
      setPlaceholder(true)
    } else {
      setEvents(false)
      setStats(false)
      setAccount(false)
      setCalendar(false)
      setPlaceholder(false)
    }
  }

  // Handlers for opening the cards on click
  const handleEventsClick = () => {
    events ? hideAllButOne('') : hideAllButOne('events')
  }

  const handleStatsClick = () => {
    stats ? hideAllButOne('') : hideAllButOne('stats')
  }

  const handleAccountClick = () => {
    account ? hideAllButOne('') : hideAllButOne('account')
  }

  const handleCalendarClick = () => {
    calendar ? hideAllButOne('') : hideAllButOne('calendar')
  }

  const handlePlaceholderClick = () => {
    placeholder ? hideAllButOne('') : hideAllButOne('placeholder')
  }

  return (
    <div className={styles.main}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage}>
          <Image src={imgBackground} alt="Background image" quality={100} fill />
        </div>
      </div>
      <div className={styles.dashboardWrapper}>
        <div className={styles.contentWrapper}>
          <div
            className={styles.content}
            style={{
              flexDirection: screenWidth < 1000 ? 'column' : 'row',
            }}
          >
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
                <Calendar />
              </div>
              <div className={placeholder ? styles.placeholderCard : styles.hidden}>
                placeholder card
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
