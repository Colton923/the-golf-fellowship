'use client'

import Link from 'next/link'
import Login from '@components/login/Login'
import styles from './Navbar.module.css'
import { useDisclosure } from '@mantine/hooks'
import { useSiteContext } from '@components/context/Context'
export default function Navbar() {
  const [opened, { open, close }] = useDisclosure(false)
  const { user, logout } = useSiteContext()

  const HandleLogin = () => {
    if (opened) return
    open()
  }

  const UserSVG = () => {
    return (
      <svg
        onClick={() => {
          HandleLogin()
        }}
        key={'nav2'}
        style={{
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          outline: 'none',
        }}
        width="55px"
        height="55px"
        viewBox="0 0 24 24"
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="f1" x="-0.1" y="-0.1" width="1.5" height="1.5">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation=".5"
              floodColor="rgba(255,255,255,0.1)"
            />
          </filter>
        </defs>
        <circle
          stroke="#000"
          fill="none"
          className="cls-1"
          cx="12"
          cy="7.25"
          r="5.73"
          filter="url(#f1)"
        />
        <path
          stroke="#000"
          fill="none"
          className="cls-1"
          d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
          filter="url(#f1)"
        />
        <text x="5" y="23" fill="white" fontSize={'4px'}>
          Login
        </text>
      </svg>
    )
  }
  const UserSignOutSVG = () => {
    return (
      <svg
        key={'nav2'}
        style={{
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          outline: 'none',
        }}
        width="55px"
        height="55px"
        viewBox="0 0 24 24"
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="f1" x="-0.1" y="-0.1" width="1.5" height="1.5">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation=".5"
              floodColor="rgba(255,255,255,0.1)"
            />
          </filter>
        </defs>
        <circle
          stroke="#000"
          fill="none"
          className="cls-1"
          cx="12"
          cy="7.25"
          r="5.73"
          filter="url(#f1)"
        />
        <path
          stroke="#000"
          fill="none"
          className="cls-1"
          d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"
          filter="url(#f1)"
        />
        <text x="3" y="23" fill="white" fontSize={'4px'}>
          Logout
        </text>
      </svg>
    )
  }
  const ShopSVG = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="55px"
        height="55px"
        viewBox="0 0 485 485"
      >
        <defs>
          <filter id="f2" x="-0.1" y="-0.1" width="1.5" height="1.5">
            <feDropShadow
              dx="0"
              dy="20"
              stdDeviation=".5"
              floodColor="rgba(255,255,255,0.1)"
            />
          </filter>
        </defs>
        <path
          filter="url(#f2)"
          fill="#000"
          stroke="#000"
          d="M 183.11 373.634 C 142.147 373.636 116.546 416.684 137.03 451.121 C 157.513 485.558 208.718 485.556 229.198 451.118 C 233.867 443.265 236.326 434.357 236.326 425.291 C 236.292 396.774 212.486 373.665 183.11 373.634 Z M 183.11 454.516 C 159.935 454.514 145.451 430.158 157.04 410.675 C 168.631 391.191 197.601 391.194 209.187 410.678 C 211.828 415.122 213.219 420.161 213.219 425.291 C 213.2 441.425 199.731 454.499 183.11 454.516 Z M 392.545 373.634 C 351.581 373.634 325.979 416.681 346.461 451.119 C 366.942 485.557 418.147 485.557 438.628 451.119 C 443.299 443.267 445.758 434.359 445.758 425.291 C 445.724 396.774 421.92 373.666 392.545 373.634 Z M 392.545 454.516 C 369.369 454.516 354.883 430.161 366.471 410.676 C 378.059 391.193 407.03 391.193 418.618 410.676 C 421.26 415.12 422.651 420.16 422.651 425.291 C 422.632 441.424 409.164 454.498 392.545 454.516 Z M 478.981 97.505 L 116.712 97.505 L 108.855 52.592 C 104.199 25.597 80.102 5.839 51.907 5.898 L 18.857 5.898 C 9.963 5.898 4.405 15.244 8.851 22.722 C 10.915 26.192 14.729 28.329 18.857 28.329 L 51.906 28.329 C 68.823 28.292 83.282 40.147 86.076 56.344 L 127.91 295.587 C 132.567 322.584 156.67 342.343 184.868 342.28 L 431.147 342.28 C 440.041 342.28 445.599 332.934 441.153 325.457 C 439.089 321.987 435.275 319.849 431.147 319.849 L 184.863 319.849 C 167.946 319.886 153.487 308.031 150.693 291.834 L 146.488 267.779 L 387.976 267.779 C 418.122 267.845 444.835 248.934 453.981 221.049 L 489.982 112.147 C 492.376 104.907 486.813 97.504 478.981 97.504 L 478.981 97.505 Z M 431.979 214.198 C 425.879 232.787 408.072 245.392 387.975 245.348 L 142.564 245.348 L 120.634 119.935 L 463.14 119.935 L 431.979 214.198 Z"
        ></path>
      </svg>
    )
  }

  return (
    <>
      {opened && <Login close={close} opened={opened} />}
      <div className={styles.navbarMain}>
        <div className={styles.navbarContainer}>
          <Link href={user ? '/dashboard' : '/'} className={styles.spinner} />
        </div>
        <nav className={styles.navbar}>
          {!user ? (
            <div className={styles.navbarLink}>
              <UserSVG />
            </div>
          ) : (
            <Link href="/" className={styles.navbarLink} onClick={logout}>
              <UserSignOutSVG />
            </Link>
          )}
          <Link href="/shop" className={styles.navbarLink} key={'nav3'}>
            <ShopSVG />
          </Link>
        </nav>
      </div>
    </>
  )
}
