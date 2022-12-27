'use client'

import AdminNavbar from './AdminNavbar'
import DashboardNavbar from './DashboardNavbar'
import HomeNavbar from './HomeNavbar'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (user) {
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_COLTON_SECRET_UID) {
        setIsAdmin(true)
      }
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_KERRY_SECRET_UID) {
        setIsAdmin(true)
      }
    }
  }, [user])

  return (
    <>{user ? isAdmin ? <AdminNavbar /> : <DashboardNavbar /> : <HomeNavbar />}</>
  )
}
