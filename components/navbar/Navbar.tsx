'use client'

import Link from 'next/link'
import { useSiteContext } from 'components/context/Context'
import Login from '@components/login/Login'
import styles from './Navbar.module.css'

import { auth } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { Notification, Container, Group, Text } from '@mantine/core'
export default function Navbar() {
  const [user] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const { setShowSignUp, showSignUp } = useSiteContext()
  const [showNotification, setShowNotification] = useState(true)
  const [notified, setNotified] = useState(false)

  useEffect(() => {
    if (user) {
      if (
        user.uid === process.env.NEXT_PUBLIC_ADMIN_COLTON_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_KERRY_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_PAUL_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_JOURDAN_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_RAIMOND_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_JAMES_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_AARON_SECRET_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_OMAR_UID ||
        user.uid === process.env.NEXT_PUBLIC_ADMIN_ALEX_UID
      ) {
        setIsAdmin(true)
      }
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const signOut = () => {
    auth.signOut()
  }
  const HandleLogin = () => {
    if (!setShowSignUp) return
    setShowSignUp(!showSignUp)
  }

  return (
    <>
      {showSignUp && <Login />}
      <div className={styles.navbarMain}>
        <div className={styles.navbarContainer}>
          <Link href={user ? '/dashboard' : '/'} className={styles.spinner} />
        </div>
        <nav className={styles.navbar}>
          {!user && (
            <>
              <div className={styles.navbarLink}>
                <svg
                  onClick={() => {
                    HandleLogin()
                  }}
                  key={'nav2'}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    outline: 'none',
                  }}
                  width="55px"
                  height="55px"
                  viewBox="0 0 24 24"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    stroke="#000"
                    fill="none"
                    className="cls-1"
                    cx="12"
                    cy="7.25"
                    r="5.73"
                  />
                  <path
                    stroke="#000"
                    fill="none"
                    className="cls-1"
                    d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
                  />
                  <text x="5" y="23" fill="black" fontSize={'4px'}>
                    Login
                  </text>
                </svg>
              </div>
              <Link href="/shop" className={styles.navbarLink} key={'nav3'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="55px"
                  height="55px"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#000"
                    d="M199.039 373.883A46.059 46.059 0 10245.1 419.942 46.112 46.112 0 00199.039 373.883zm0 72.117A26.059 26.059 0 11225.1 419.942 26.088 26.088 0 01199.039 446zM380.316 373.883a46.059 46.059 0 1046.059 46.059A46.112 46.112 0 00380.316 373.883zm0 72.117a26.059 26.059 0 1126.059-26.058A26.088 26.088 0 01380.316 446zM455.132 127.679H141.567l-6.8-40.046A49.869 49.869 0 0085.475 46H56.868a10 10 0 100 20H85.474A29.92 29.92 0 01115.05 90.979l36.21 213.315a49.87 49.87 0 0049.3 41.633H413.729a10 10 0 000-20H200.556a29.92 29.92 0 01-29.576-24.979L167.34 279.5H376.362a59.816 59.816 0 0057.131-41.666l31.161-97.1a10 10 0 00-9.522-13.056zM414.449 231.726A39.879 39.879 0 01376.361 259.5H163.944L144.962 147.678H441.42z"
                  ></path>
                </svg>
              </Link>
            </>
          )}
          {!isAdmin && user && (
            <>
              <Link href="/" className={styles.navbarLink} onClick={signOut}>
                <svg
                  key={'nav2'}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    outline: 'none',
                  }}
                  width="55px"
                  height="55px"
                  viewBox="0 0 24 24"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    stroke="#000"
                    fill="none"
                    className="cls-1"
                    cx="12"
                    cy="7.25"
                    r="5.73"
                  />
                  <path
                    stroke="#000"
                    fill="none"
                    className="cls-1"
                    d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
                  />
                </svg>
              </Link>
              <Link href="/shop" className={styles.navbarLink} key={'nav3'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="55px"
                  height="55px"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#000"
                    d="M199.039 373.883A46.059 46.059 0 10245.1 419.942 46.112 46.112 0 00199.039 373.883zm0 72.117A26.059 26.059 0 11225.1 419.942 26.088 26.088 0 01199.039 446zM380.316 373.883a46.059 46.059 0 1046.059 46.059A46.112 46.112 0 00380.316 373.883zm0 72.117a26.059 26.059 0 1126.059-26.058A26.088 26.088 0 01380.316 446zM455.132 127.679H141.567l-6.8-40.046A49.869 49.869 0 0085.475 46H56.868a10 10 0 100 20H85.474A29.92 29.92 0 01115.05 90.979l36.21 213.315a49.87 49.87 0 0049.3 41.633H413.729a10 10 0 000-20H200.556a29.92 29.92 0 01-29.576-24.979L167.34 279.5H376.362a59.816 59.816 0 0057.131-41.666l31.161-97.1a10 10 0 00-9.522-13.056zM414.449 231.726A39.879 39.879 0 01376.361 259.5H163.944L144.962 147.678H441.42z"
                  ></path>
                </svg>
              </Link>
            </>
          )}
          {isAdmin && user && (
            <>
              <Link href="/" className={styles.navbarLink} onClick={signOut}>
                <svg
                  key={'nav2'}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    outline: 'none',
                  }}
                  width="55px"
                  height="55px"
                  viewBox="0 0 24 24"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle stroke="#000" fill="none" cx="12" cy="7.25" r="5.73" />
                  <path
                    stroke="#000"
                    fill="none"
                    d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
                  />
                  <text x="3" y="23" fill="black" fontSize={'4px'}>
                    Logout
                  </text>
                </svg>
              </Link>
              <div className={styles.navbarTextWrapper} key={'nav5'}>
                <Link href="/godaddy" className={styles.navbarLinkText}>
                  Admin Data
                </Link>
              </div>
              <Link
                href="/shop"
                className={styles.navbarLink}
                style={{
                  marginBottom: '35px',
                  marginLeft: '10px',
                }}
                key={'nav3'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="25px"
                  height="25px"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#000"
                    d="M199.039 373.883A46.059 46.059 0 10245.1 419.942 46.112 46.112 0 00199.039 373.883zm0 72.117A26.059 26.059 0 11225.1 419.942 26.088 26.088 0 01199.039 446zM380.316 373.883a46.059 46.059 0 1046.059 46.059A46.112 46.112 0 00380.316 373.883zm0 72.117a26.059 26.059 0 1126.059-26.058A26.088 26.088 0 01380.316 446zM455.132 127.679H141.567l-6.8-40.046A49.869 49.869 0 0085.475 46H56.868a10 10 0 100 20H85.474A29.92 29.92 0 01115.05 90.979l36.21 213.315a49.87 49.87 0 0049.3 41.633H413.729a10 10 0 000-20H200.556a29.92 29.92 0 01-29.576-24.979L167.34 279.5H376.362a59.816 59.816 0 0057.131-41.666l31.161-97.1a10 10 0 00-9.522-13.056zM414.449 231.726A39.879 39.879 0 01376.361 259.5H163.944L144.962 147.678H441.42z"
                  ></path>
                </svg>
              </Link>
            </>
          )}
        </nav>
      </div>
      {showNotification && !notified && (
        <Notification
          onClose={() => {
            setNotified(true)
            setShowNotification(false)
          }}
          title={
            user?.displayName
              ? `Welcome ${user?.displayName}`
              : user?.phoneNumber
              ? `Welcome ${user?.phoneNumber}`
              : `Welcome.`
          }
          color="white"
          style={{
            backgroundColor: 'rgb(100, 100, 100)',
            bottom: '0',
            position: 'fixed',
            zIndex: 100,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {user &&
            `
          Thank you for being a member since ${user?.metadata.creationTime}. Your last
          login was ${user?.metadata.lastSignInTime}.
          `}
        </Notification>
      )}
    </>
  )
}
