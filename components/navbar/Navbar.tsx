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
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_COLTON_SECRET_UID) {
        setIsAdmin(true)
      }
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_KERRY_SECRET_UID) {
        setIsAdmin(true)
      }
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_KARSTON_SECRET_UID) {
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
          <Image
            src={logo}
            alt="TGF Logo"
            fill
            className={styles.navbarImage}
            onClick={() => {
              window.location.href = '/'
            }}
            style={{ cursor: 'pointer' }}
          />
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
        <div className={styles.navbarContainer}>
          <nav className={styles.navbar}>
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
