'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'

export default function Page() {
  const [user, loading, error] = useAuthState(auth)

  console.log(user)
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
