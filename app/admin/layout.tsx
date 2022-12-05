'use client'

import styles from '../../styles/Admin.module.css'
import AdminNavbar from '../../components/AdminNavbar'

export default function Layout({ children }: any) {
  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div>{children}</div>
    </div>
  )
}
