import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import logo from '../public/static/images/tgf_logo.jpg'

export default function HomeNavbar() {
  return (
    <div className={styles.navbarmain}>
      <div className={styles.navimageborder}>
        <Image src={logo} alt="TGF Logo" height="75" width="75" className={styles.navimage} />
      </div>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navbarlink}>
          Home
        </Link>
        <Link href="/login" className={styles.navbarlink}>
          Login
        </Link>
      </nav>
    </div>
  )
}
