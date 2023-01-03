'use client'
import styles from './Cards.module.css'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

type RegisterForm = {
  firstNameCardOne: string
  lastNameCardOne: string
  emailCardOne: string
  phoneCardOne: string
}

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

  useEffect(() => {
    if (phoneCardOne.length >= 10) {
      const test = standardizePhone(phoneCardOne)
      if (test !== false) {
        setValue('phoneCardOne', test)
        const handleFormSubmit = () => {
          submitRegisterForm({
            firstNameCardOne: firstNameCardOne,
            lastNameCardOne: lastNameCardOne,
            emailCardOne: emailCardOne,
            phoneCardOne: test,
          })
        }
        handleFormSubmit()
      }
    }
  }, [phoneCardOne])

  const standardizePhone = (phone: string) => {
    //###-###-####
    let newPhone = phone.replace(/[^0-9]/g, '')
    if (newPhone.length === 10) {
      newPhone = newPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    } else {
      return false
    }
    return newPhone
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: 'onSubmit' })

  const submitRegisterForm = (data: RegisterForm) => {
    if (
      firstNameCardOne !== '' &&
      lastNameCardOne !== '' &&
      emailCardOne !== '' &&
      phoneCardOne.length >= 10
    ) {
      const newPhone = standardizePhone(phoneCardOne)
      if (newPhone !== false) {
        setPhoneCardOne(newPhone)
        props.setUserPhone(newPhone)
      } else {
        props.setUserPhone(phoneCardOne)
      }
      setIsCollapsed(true)
      props.isCardOneValid(true)
      props.setUserFirstName(firstNameCardOne)
      props.setUserLastName(lastNameCardOne)
      props.setUserEmail(emailCardOne)
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
            <small>
              {' ' + firstNameCardOne} {lastNameCardOne}
            </small>
          </label>
          <label className={styles.cardFormItemLabel}>
            EMAIL: <small>{emailCardOne}</small>
          </label>
          <label className={styles.cardFormItemLabel}>
            PHONE: <small>{phoneCardOne}</small>
          </label>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(submitRegisterForm)}
        className={isCollapsed ? styles.cardFormTwoCollapsed : styles.cardFormTwo}
        id="cardOneForm"
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
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstNameCardOne(e.target.value)
                    setValue('firstNameCardOne', e.target.value)
                  }}
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
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLastNameCardOne(e.target.value)
                    setValue('lastNameCardOne', e.target.value)
                  }}
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
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmailCardOne(e.target.value)
                    setValue('emailCardOne', e.target.value)
                  }}
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
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPhoneCardOne(e.target.value)
                    setValue('phoneCardOne', e.target.value)
                  }}
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
