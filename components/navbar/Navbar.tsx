'use client'
import Link from 'next/link'
import Image from 'next/image'

import styles from './Navbar.module.css'

import logo from '@public/static/images/tgf_logo.jpg'

import { auth } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'

export interface NavbarProps {
  showLogin?: () => void
}

export default function Navbar(props: NavbarProps) {
  const [user] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)

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
    }
  }, [user])

  const signOut = () => {
    auth.signOut()
  }

  return (
    <div className={styles.navbarMain}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarImageWrapper}>
          {/* SVG Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.navbarImage}
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={() => {
              if (props.showLogin) props.showLogin()
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
          {!user ? (
            <>
              <div className={styles.navbarTextWrapper}>
                <h1
                  onClick={() => {
                    if (props.showLogin) props.showLogin()
                  }}
                  className={styles.navbarLink}
                  key={'nav2'}
                  style={{ cursor: 'pointer' }}
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
          ) : (
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
        </nav>
      </div>
      {isAdmin && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            margin: '0',
            backgroundImage:
              'linear-gradient(45deg, rgba(255, 255, 255, 0.01) 1%, rgba(255, 255, 255, 0.1) 70%)',
            backgroundSize: '3px',
            backdropFilter: 'blur(15px)',
            boxShadow: ' 0 4px 10px 2px rgba(0, 0, 0, 0.6)',
          }}
        >
          <nav
            className={styles.navbar}
            style={{
              justifyContent: 'space-evenly',
              marginLeft: '5%',
            }}
          >
            <div className={styles.navbarTextWrapper} key={'nav3'}>
              <Link href="/admin" className={styles.navbarLink}>
                Admin
              </Link>
            </div>
            <div className={styles.navbarTextWrapper} key={'nav5'}>
              <Link href="/godaddy" className={styles.navbarLink}>
                GoDaddy
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
