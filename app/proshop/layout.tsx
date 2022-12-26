'use client'
import DashboardNavbar from '../../components/DashboardNavbar'
import styles from '../../styles/ProShop.module.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import HomeNavbar from '../../components/HomeNavbar'
import { useCallback, useState } from 'react'

interface ProShopLayoutProps {
  children: React.ReactNode
}

export default function ProShopLayout({ children }: ProShopLayoutProps) {
  const [user, loading, error] = useAuthState(auth)
  const [showSignupMenu, setShowSignupMenu] = useState(false)

  const wrapperSetShowSignupMenu = useCallback(
    (showSignupMenu: boolean) => {
      setShowSignupMenu(showSignupMenu)
    },
    [setShowSignupMenu]
  )

  return (
    <div className={styles.pageWrap}>
      {!user ? (
        <HomeNavbar showSignupMenuSetter={wrapperSetShowSignupMenu} />
      ) : (
        <DashboardNavbar />
      )}
      <div>{children}</div>
    </div>
  )
}
