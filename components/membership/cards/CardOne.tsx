'use client'
import styles from './Cards.module.css'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { forEachChild } from 'typescript'
import { ChangeDetectionStrategyType } from 'ag-grid-react'

type RegisterForm = {
  firstNameCardOne: string
  lastNameCardOne: string
  emailCardOne: string
  phoneCardOne: string
}

const phoneRegex = new RegExp('^(\\([0-9]{3}\\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$')

interface CardOneProps {
  isCardOneValid: (valid: boolean) => void
  setUserFirstName: (firstName: string) => void
  setUserLastName: (lastName: string) => void
  setUserEmail: (email: string) => void
  setUserPhone: (phone: string) => void
}

export default function CardOne(props: CardOneProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [firstNameCardOne, setFirstNameCardOne] = useState('')
  const [lastNameCardOne, setLastNameCardOne] = useState('')
  const [emailCardOne, setEmailCardOne] = useState('')
  const [phoneCardOne, setPhoneCardOne] = useState('')
  const [isCardOneValid, setIsCardOneValid] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: 'onChange' })

  const submitRegisterForm = (data: RegisterForm) => {
    console.log(phoneCardOne.length)
    if (
      firstNameCardOne !== '' &&
      lastNameCardOne !== '' &&
      emailCardOne !== '' &&
      phoneCardOne.length >= 11 &&
      isCardOneValid === false
    ) {
      setIsCardOneValid(true)
      Collapse()
      props.isCardOneValid(true)
      props.setUserFirstName(firstNameCardOne)
      props.setUserLastName(lastNameCardOne)
      props.setUserEmail(emailCardOne)
      props.setUserPhone(phoneCardOne)
    }
  }
  const Collapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={styles.cardForm}>
      <div
        className={isCollapsed ? styles.cardFormOne : styles.cardFormOneCollapsed}
      >
        <div className={styles.cardFormItem}>
          <label className={styles.cardFormItemLabel}>
            MEMBER:
            {' ' + firstNameCardOne} {lastNameCardOne}
          </label>
          <label className={styles.cardFormItemLabel}>EMAIL: {emailCardOne}</label>
          <label className={styles.cardFormItemLabel}>PHONE: {phoneCardOne}</label>
        </div>
      </div>
      <form
        onChange={handleSubmit(submitRegisterForm)}
        className={isCollapsed ? styles.cardFormTwoCollapsed : styles.cardFormTwo}
        autoComplete="off"
      >
        <div className={styles.cardFormItem}>
          <label className={styles.cardFormItemLabel}>MEMBER</label>
          <div className={styles.cardFormItemGroup}>
            <div className={styles.cardFormOptionWrap}>
              <div className={styles.option}>
                <input
                  id="firstNameCardOne"
                  className={styles.optionInput}
                  type="text"
                  placeholder="First Name"
                  {...register('firstNameCardOne', { required: true })}
                  onChange={(e) => setFirstNameCardOne(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={styles.cardFormOptionWrap}>
              <div className={styles.option}>
                <input
                  id="lastNameCardOne"
                  className={styles.optionInput}
                  type="text"
                  placeholder="Last Name"
                  {...register('lastNameCardOne', { required: true })}
                  onChange={(e) => setLastNameCardOne(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={styles.cardFormOptionWrap}>
              <div className={styles.option}>
                <input
                  id="emailCardOne"
                  className={styles.optionInput}
                  type="text"
                  placeholder="Email"
                  {...register('emailCardOne', { required: true })}
                  onChange={(e) => setEmailCardOne(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={styles.cardFormOptionWrap}>
              <div className={styles.option}>
                <input
                  id="phoneCardOne"
                  className={styles.optionInput}
                  type="text"
                  placeholder="Phone"
                  inputMode="numeric"
                  {...register('phoneCardOne', {
                    required: false,
                  })}
                  onKeyDown={(e) => {
                    if (e.currentTarget.value.length === 3) {
                      e.currentTarget.value += '-'
                    }
                    if (e.currentTarget.value.length === 7) {
                      e.currentTarget.value += '-'
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.currentTarget.value.length === 12) {
                      if (e.currentTarget.value.match(phoneRegex) === null) {
                        e.currentTarget.value = ''
                      }
                    }
                    if (e.currentTarget.value.length > 12) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 12)
                    }
                  }}
                  onChange={(e) => setPhoneCardOne(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className={styles.svgWrap}>
        <div className={isCollapsed ? styles.svgRotateOne : styles.svgRotateTwo}>
          <svg
            onClick={Collapse}
            className={styles.svg}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  )
}
