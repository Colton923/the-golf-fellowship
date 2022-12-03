'use client'

import styles from '../../styles/Admin.module.css'
import DashboardNavbar from './AdminNavbar'

export default function Layout({ children }: any) {
  return (
    <div>
      <DashboardNavbar />
      <div>{children}</div>
    </div>
  )
}
