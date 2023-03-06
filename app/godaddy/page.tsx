'use client'

import { Receipts } from '@components/data/Receipts'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import { useEffect, useState } from 'react'

export default function Page() {
  const [user, loading, error] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_COLTON_SECRET_UID) {
        setIsAdmin(true)
      }
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_KERRY_SECRET_UID) {
        setIsAdmin(true)
      }
      if (user.uid === process.env.NEXT_PUBLIC_ADMIN_RAIMOND_SECRET_UID) {
        setIsAdmin(true)
      }
    }
  }, [user])

  if (error || loading) {
    return <div> Loading..</div>
  }

  if (isAdmin) {
    return (
      <div>
        <input
          type="button"
          value="Clean"
          onClick={() => {
            fetch('/api/firebase/cleanGoDaddyData', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}),
            }).then((res) => {
              res
                .json()
                .then((data) => {
                  if (data.deleteCount === 0) {
                    alert('No data to delete')
                  } else {
                    alert(data.message + ' ' + data.deleteCount)
                  }
                })
                .catch((error) => {
                  alert(error)
                })
            })
          }}
        />
        <Receipts />
      </div>
    )
  } else {
    return (
      <div>
        <h1>How did you get here?</h1>
      </div>
    )
  }
}
