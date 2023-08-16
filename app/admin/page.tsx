'use client'
import styles from '@styles/Admin.module.css'
import CreateEvents from '@components/golfGenius/CreateEvents'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'

import { stripeSubscriptionBody } from '../../types/stripe/stripeSubscriptionBody'
import { auth } from '../../firebase/firebaseClient'

export default function Page() {
  const [show, setShow] = useState(false)
  const [user, loading, error] = useAuthState(auth)

  const router = useRouter()
  const uid = auth.currentUser?.uid

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<stripeSubscriptionBody>()

  const onSubmit = (data: stripeSubscriptionBody) => {
    if (uid) {
      data.sub.currency = 'usd'
      data.uid = uid
      console.log('todo: create subscription', data)
    } else {
      console.log('You are not logged in.')
    }
  }

  if (error) {
    return <div>error {error.message}</div>
  }

  if (loading) {
    return <div>loading</div>
  }

  if (!user) {
    router.push('/membership')
  }

  return (
    <div className={styles.pageWrapper}>
      {show ? (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="text"
                placeholder="Name"
                {...register('sub.name', {
                  required: true,
                })}
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Description"
                {...register('sub.description', {
                  required: true,
                })}
              />
            </div>
            <div>
              <label htmlFor="unit_amount">Unit Amount</label>
              <input
                id="unit_amount"
                type="text"
                placeholder="(1000) = ($10.00)"
                {...register('sub.unit_amount', {
                  required: true,
                })}
              />
            </div>
            <div>
              <label htmlFor="recurring.interval">Recurring Interval</label>
              <input
                id="recurring.interval"
                type="text"
                placeholder="( day | week | month | year )"
                {...register('sub.recurring.interval', {
                  required: true,
                })}
              />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      ) : (
        <CreateEvents />
      )}
    </div>
  )
}
