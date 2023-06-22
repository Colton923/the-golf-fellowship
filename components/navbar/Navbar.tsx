'use client'

import Link from 'next/link'
import { useSiteContext } from 'components/context/Context'
import Login from '@components/login/Login'
import styles from './Navbar.module.css'

import { auth } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { Notification } from '@mantine/core'

export default function Navbar() {
  const [user] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const { setShowSignUp, showSignUp } = useSiteContext()
  const [showNotification, setShowNotification] = useState(true)

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
          <div className={styles.navbarImageWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.navbarImage}
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => {
                if (setShowSignUp !== undefined && showSignUp !== undefined)
                  setShowSignUp(!showSignUp)
              }}
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <nav className={styles.navbar}>
            {!user && (
              <>
                <div className={styles.navbarTextWrapper}>
                  <h1
                    onClick={() => {
                      HandleLogin()
                    }}
                    className={styles.navbarLink}
                    key={'nav2'}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      outline: 'none',
                    }}
                  >
                    Login
                  </h1>
                </div>
                <div className={styles.navbarTextWrapper}>
                  <Link href="/shop" className={styles.navbarLink} key={'nav3'}>
                    Shop
                  </Link>
                </div>
              </>
            )}
            {!isAdmin && user && (
              <>
                <div className={styles.navbarTextWrapper}>
                  <Link href="/" className={styles.navbarLink} key={'nav1'}>
                    Home
                  </Link>
                </div>
                <div className={styles.navbarTextWrapper} key={'nav2'}>
                  <Link href="/" className={styles.navbarLink} onClick={signOut}>
                    Logout
                  </Link>
                </div>
                <div className={styles.navbarTextWrapper}>
                  <Link href="/shop" className={styles.navbarLink} key={'nav3'}>
                    Shop
                  </Link>
                </div>
              </>
            )}
            {isAdmin && user && (
              <>
                <div className={styles.navbarTextWrapper}>
                  <Link href="/" className={styles.navbarLink} key={'nav1'}>
                    Home
                  </Link>
                </div>
                <div className={styles.navbarTextWrapper} key={'nav2'}>
                  <Link href="/" className={styles.navbarLink} onClick={signOut}>
                    Logout
                  </Link>
                </div>
                <div className={styles.navbarTextWrapper}>
                  <Link href="/shop" className={styles.navbarLink} key={'nav3'}>
                    Shop
                  </Link>
                </div>
                <div className={styles.navbarTextWrapper} key={'nav3'}>
                  <Link href="/test" className={styles.navbarLink}>
                    Test
                  </Link>
                </div>
                <div className={styles.navbarTextWrapper} key={'nav5'}>
                  <Link href="/godaddy" className={styles.navbarLink}>
                    GoDaddy
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
      {showNotification && (
        <Notification
          onClose={() => setShowNotification(false)}
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
