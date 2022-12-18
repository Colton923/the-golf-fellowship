import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import logo from '../public/static/images/tgf_logo.jpg'

export default function HomeNavbar() {
  return (
    <div className={styles.navbarMain}>
      <div className={styles.navbarContainer}>
        <Image
          src={logo}
          alt="TGF Logo"
          height="75"
          width="75"
          className={styles.navbarImage}
        />
        <nav className={styles.navbar}>
          <div className={styles.navbarTextWrapper}>
            <Link href="/" className={styles.navbarLink} key={'nav1'}>
              Home
            </Link>
          </div>
          <div className={styles.navbarTextWrapper}>
            <Link href="/login" className={styles.navbarLink} key={'nav2'}>
              Login
            </Link>
          </div>
          <div className={styles.navbarTextWrapper}>
            <Link href="/proshop" className={styles.navbarLink} key={'nav3'}>
              Pro Shop
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
