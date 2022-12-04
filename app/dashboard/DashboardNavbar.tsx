'use client'

import Link from 'next/link'
import styles from '../../styles/Navbar.module.css'
import Image from 'next/image'
import logo from '../../public/static/images/tgf_logo.jpg'
import { auth } from '../../firebase/firebaseClient'

export default function DashboardNavbar() {
  const signOut = () => {
    auth.signOut()
  }

  return (
    <div className={styles.navbarmain}>
      <div className={styles.navimageborder}>
        <Image src={logo} alt="TGF Logo" height="75" width="75" className={styles.navimage} />
      </div>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navbarlink}>
          Home
        </Link>
        <Link href="/" className={styles.navbarlink} onInput={signOut}>
          Logout
        </Link>
        <Link href="/admin" className={styles.navbarlink}>
          Admin
        </Link>
        <Link href="/proshop" className={styles.navbarlink}>
          Admin
        </Link>
      </nav>
    </div>
  )
}
