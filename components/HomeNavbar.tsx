import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import logo from '../public/static/images/tgf_logo.jpg'

interface HomeNavbarProps {
  showSignupMenuSetter: (showSignupMenu: boolean) => void
}

export default function HomeNavbar(props: HomeNavbarProps) {
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
            <h1
              onClick={() => {
                props.showSignupMenuSetter(true)
              }}
              className={styles.navbarLink}
              key={'nav2'}
              style={{ cursor: 'pointer' }}
            >
              Login
            </h1>
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
