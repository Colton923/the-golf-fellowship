'use client'

import AdminNavbar from '../../components/AdminNavbar'

export default function Layout({ children }: any) {
  return (
    <div>
      <AdminNavbar />
      <div>{children}</div>
    </div>
  )
}
