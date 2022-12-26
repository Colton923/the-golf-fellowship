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
        <div className={styles.navbarImageWrapper}>
          <Image src={logo} alt="TGF Logo" fill className={styles.navbarImage} />
        </div>
        <nav className={styles.navbar}>
          <div className={styles.navbarTextWrapper} key={'nav1'}>
            <Link href="/" className={styles.navbarLink}>
              Home
            </Link>
          </div>
          <div className={styles.navbarTextWrapper} key={'nav2'}>
            <Link href="/" className={styles.navbarLink} onClick={signOut}>
              Logout
            </Link>
          </div>
          <div className={styles.navbarTextWrapper} key={'nav3'}>
            <Link href="/admin" className={styles.navbarLink}>
              Admin
            </Link>
          </div>
          <div className={styles.navbarTextWrapper} key={'nav4'}>
            <Link href="/proshop" className={styles.navbarLink}>
              Pro Shop
            </Link>
          </div>
          <div className={styles.navbarTextWrapper} key={'nav5'}>
            <Link href="/godaddy" className={styles.navbarLink}>
              GoDaddy
            </Link>
          </div>
          <div className={styles.navbarTextWrapper} key={'nav6'}>
            <Link href="/dashboard" className={styles.navbarLink}>
              Dashboard
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
