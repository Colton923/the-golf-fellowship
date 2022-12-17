'use client'
import DashboardNavbar from '../../components/DashboardNavbar'
import styles from '../../styles/ProShop.module.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import HomeNavbar from '../../components/HomeNavbar'
interface ProShopLayoutProps {
  children: React.ReactNode
}

export default function ProShopLayout({ children }: ProShopLayoutProps) {
  const [user, loading, error] = useAuthState(auth)

  return (
    <div className={styles.pageWrap}>
      {!user ? <HomeNavbar /> : <DashboardNavbar />}
      <div>{children}</div>
    </div>
  )
}
