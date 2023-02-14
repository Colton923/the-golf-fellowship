'use client'
import Membership from '@components/membership/Membership'
import { auth } from '../../firebase/firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Events } from '@components/stripe/products/events/Events'

export default function Page() {
  const [user, loading, error] = useAuthState(auth)

  if (loading && !error) {
    return <>Loading...</>
  }
  if (error && !loading) {
    return <>Error: {error}</>
  }
  if (!user) {
    return (
      <div>
        <Membership />
      </div>
    )
  } else {
    return (
      <div>
        <Events />
      </div>
    )
  }
}
