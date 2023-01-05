'use client'
import Image from 'next/image'
import imgBackground from '../../public/static/images/tgf_dashboard_background.png'
import styles from '../../styles/Dashboard.module.css'
import GolferSVG from '../../components/svgs/golfer'

import { useEffect } from 'react'
import { useState } from 'react'
import { auth } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'

import { Calendar } from '../../components/calendar/Calendar'
import { Account } from '../../components/account/Account'

export default function Page() {
  const [events, setEvents] = useState(false)
  const [stats, setStats] = useState(false)
  const [account, setAccount] = useState(false)
  const [calendar, setCalendar] = useState(false)
  const [placeholder, setPlaceholder] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [showOptions, setShowOptions] = useState(true)
  const [user] = useAuthState(auth)

  const router = useRouter()

  const initialScreenWidth = () => {
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    initialScreenWidth()
  }, [])

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
      if (screenWidth < 1000) {
        setShowOptions(false)
      }
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

  // if (!user) {
  //   return (
  //     <>
  //       <div>
  //         <h1>Not logged in</h1>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
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
            <div className={showOptions ? styles.userOptionWrapper : styles.hidden}>
              <div className={styles.userOption} onClick={handleStatsClick}>
                Statistics
              </div>
              <div className={styles.userOption} onClick={handleAccountClick}>
                My Account
              </div>
              <div className={styles.userOption} onClick={handleCalendarClick}>
                Calendar
              </div>
              <div className={styles.userOption} onClick={handlePlaceholderClick}>
                Placeholder
              </div>
            </div>
            <div className={styles.cardsWrapper}>
              <div className={events ? styles.card : styles.hidden}>events card</div>
              <div className={stats ? styles.card : styles.hidden}>stats card</div>
              <div className={account ? styles.card : styles.hidden}>
                <Account />
              </div>
              <div className={calendar ? styles.card : styles.hidden}>
                <Calendar />
              </div>
              <div className={placeholder ? styles.card : styles.hidden}>
                placeholder card
              </div>
            </div>
          </div>
        </div>
        <div className={styles.toggleWrapper}>
          <div
            className={styles.toggle}
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.toggleIcon}
              >
                <path d="M18 15L12 9 6 15"></path>
              </svg>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.toggleIcon}
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </>
            )}
          </div>
          {showOptions ? null : (
            <>
              <div className={styles.toggle}>
                <div
                  className={styles.userOptionCollapsed}
                  onClick={handleStatsClick}
                >
                  <svg viewBox="0 0 512 512">
                    <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" />
                  </svg>
                </div>
              </div>
              <div className={styles.toggle}>
                <div
                  className={styles.userOptionCollapsed}
                  onClick={handleAccountClick}
                >
                  <GolferSVG />
                </div>
              </div>
              <div className={styles.toggle}>
                <div
                  className={styles.userOptionCollapsed}
                  onClick={handleCalendarClick}
                >
                  <svg viewBox="0 0 448 512">
                    <path d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z" />
                  </svg>
                </div>
              </div>
              <div className={styles.toggle}>
                <div
                  className={styles.userOptionCollapsed}
                  onClick={handlePlaceholderClick}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
