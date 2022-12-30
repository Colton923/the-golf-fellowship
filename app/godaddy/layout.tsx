'use client'

import styles from '../../styles/GoDaddy.module.css'
import Navbar from '../../components/navbar/Navbar'

import { useState } from 'react'

export default function Layout({ children }: any) {
  const [showSignupMenu, setShowSignupMenu] = useState(false)

  const showLogin = () => {
    setShowSignupMenu(!showSignupMenu)
  }

  return (
    <div className={styles.main}>
      <Navbar showLogin={showLogin} />
      <div>{children}</div>
    </div>
  )
}
