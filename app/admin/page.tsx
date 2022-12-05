'use client'

import NewSubscription from '../../components/stripe/NewSubscription'
import { auth } from '../../firebase/firebaseClient'
import type { body } from '../../components/stripe/NewSubscription'
import { useForm } from 'react-hook-form'
import styles from '../../styles/Admin.module.css'

export default function Page() {
  const uid = auth.currentUser?.uid

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<body>()

  const onSubmit = (data: body) => {
    if (uid) {
      data.sub.currency = 'usd'
      data.uid = uid
      console.log(NewSubscription({ requestData: data }))
    } else {
      console.log('You are not logged in.')
    }
  }
  return (
    <div className={styles.pageWrapper}>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input type="text" placeholder="Name" {...register('sub.name', { required: true })} />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Description"
              {...register('sub.description', { required: true })}
            />
          </div>
          <div>
            <label htmlFor="unit_amount">Unit Amount</label>
            <input
              id="unit_amount"
              type="text"
              placeholder="(1000) = ($10.00)"
              {...register('sub.unit_amount', { required: true })}
            />
          </div>
          <div>
            <label htmlFor="recurring.interval">Recurring Interval</label>
            <input
              id="recurring.interval"
              type="text"
              placeholder="( day | week | month | year )"
              {...register('sub.recurring.interval', { required: true })}
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}
