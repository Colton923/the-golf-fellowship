'use client'

import Navbar from '../../components/navbar/Navbar'
import styles from '../../styles/Shop.module.css'
import Login from '../../components/login/Login'

import { useState, useEffect, useRef } from 'react'

export default function ShopLayout({ children }: any) {
  const [showSignupMenu, setShowSignupMenu] = useState(false)

  const navbarRef = useRef(null)
  const showLogin = () => {
    setShowSignupMenu(!showSignupMenu)
  }

  //This is the system for clicking off of the login component. See the ref={} arg on div wrapping componenet.
  const loginMain = useRef(null)
  const handleClickOffLoginMain = (e: any) => {
    if (
      loginMain.current &&
      //@ts-ignore
      !loginMain.current.contains(e.target) &&
      //@ts-ignore
      !navbarRef.current.contains(e.target)
    ) {
      setShowSignupMenu(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOffLoginMain)
    return () => {
      document.removeEventListener('mousedown', handleClickOffLoginMain)
    }
  }, [])

  return (
    <div className={styles.pageWrap}>
      <div ref={navbarRef}>
        <Navbar showLogin={showLogin} />
      </div>
      <div ref={loginMain}>
        <Login show={showSignupMenu} />
      </div>
      <div>{children}</div>
    </div>
  )
}
