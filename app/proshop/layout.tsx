'use client'
import DashboardNavbar from '../../components/DashboardNavbar'
import styles from '../../styles/ProShop.module.css'

interface ProShopLayoutProps {
  children: React.ReactNode
}

export default function ProShopLayout({ children }: ProShopLayoutProps) {
  return (
    <div className={styles.pageWrap}>
      <DashboardNavbar />
      <div>{children}</div>
    </div>
  )
}
