'use client'

import { useForm } from 'react-hook-form'
import styles from './Query.module.scss'
export type FormData = {
  fromDate?: string // xx-xx-xxxx
  toDate?: string // xx-xx-xxxx
  sku?: string
  productName?: string
  firstName?: string
  lastName?: string
  orderNumber?: string
  additionalQueryParams?: string
}

interface QueryProps {
  additionalQueryParams?: string
  submitHandler: (data: FormData) => void
}
const FormQuery = (props: QueryProps) => {
  const { register, handleSubmit, setValue } = useForm<FormData>({
    mode: 'onChange',
  })
  const { additionalQueryParams, submitHandler } = props
  const dateRegex = /^(\d{1,2}-\d{0,2}-\d{0,4}|\d{1,2}-\d{0,2}|\d{1,2})$/g

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <input
        className={styles.input}
        type="text"
        {...register('fromDate', {
          onChange: (e) => {
            if (e.target.value.match(dateRegex)) {
              setValue('fromDate', e.target.value)
            } else {
              setValue('fromDate', '')
            }
          },
          required: true,
        })}
        defaultValue={new Date(new Date().setDate(new Date().getDate() - 28))
          .toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '-')}
        placeholder="From Date"
      />

      <input
        className={styles.input}
        {...register('toDate', {
          onChange: (e) => {
            if (e.target.value.match(dateRegex)) {
              setValue('toDate', e.target.value)
            } else {
              setValue('toDate', '')
            }
          },
          required: true,
        })}
        type="text"
        defaultValue={new Date()
          .toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '-')}
      />
      {/* <input {...register('sku')} placeholder="upcoming feature" disabled={true} />
      <input
        {...register('productName')}
        placeholder="upcoming feature"
        disabled={true}
      /> */}
      <input
        className={styles.input}
        {...register('firstName')}
        placeholder="First Name"
      />
      <input
        className={styles.input}
        {...register('lastName')}
        placeholder="Last Name"
      />
      {/* <input
        {...register('orderNumber')}
        placeholder="upcoming feature"
        disabled={true}
      /> */}
      {additionalQueryParams && (
        <input
          className={styles.input}
          {...register('additionalQueryParams')}
          placeholder={additionalQueryParams}
        />
      )}
      <input className={styles.input} type="submit" />
    </form>
  )
}

export default FormQuery
