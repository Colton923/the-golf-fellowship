'use client'
import React from 'react'
import AdminNavbar from '../../components/AdminNavbar'
interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <section>{children}</section>
    </div>
  )
}
