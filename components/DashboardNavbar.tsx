'use client'

import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import logo from '../public/static/images/tgf_logo.jpg'
import { auth } from '../firebase/firebaseClient'

export default function DashboardNavbar() {
  const signOut = () => {
    auth.signOut()
  }

  return (
    <div className={styles.navbarMain}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarImageBorder}>
          <Image
            src={logo}
            alt="TGF Logo"
            height="75"
            width="75"
            className={styles.navbarImage}
          />
        </div>
        <nav className={styles.navbar}>
          <Link href="/" className={styles.navbarLink}>
            Home
          </Link>
          <Link href="/" className={styles.navbarLink} onClick={signOut}>
            Logout
          </Link>
          <Link href="/admin" className={styles.navbarLink}>
            Admin
          </Link>
          <Link href="/proshop" className={styles.navbarLink}>
            Pro Shop
          </Link>
        </nav>
      </div>
    </div>
  )
}
