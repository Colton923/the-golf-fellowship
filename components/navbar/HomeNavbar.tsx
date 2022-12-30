'use client'

import Link from 'next/link'

import styles from './Navbar.module.css'
import Image from 'next/image'
import logo from '../../public/static/images/tgf_logo.jpg'
import { NavbarProps } from './Navbar'

export default function HomeNavbar(props: NavbarProps) {
  return (
    <div className={styles.navbarMain}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarImageWrapper}>
          <Image src={logo} alt="TGF Logo" fill className={styles.navbarImage} />
        </div>
        <nav className={styles.navbar}>
          <div className={styles.navbarTextWrapper}>
            <Link href="/" className={styles.navbarLink} key={'nav1'}>
              Home
            </Link>
          </div>
          <div className={styles.navbarTextWrapper}>
            <h1
              onClick={() => {
                props.showLogin()
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
        </nav>
      </div>
    </div>
  )
}
