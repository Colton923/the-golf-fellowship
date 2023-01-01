'use client'

import styles from './Login.module.css'

import { useRouter } from 'next/navigation'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useState, useEffect } from 'react'

interface LoginProps {
  show: boolean
  setLoggedInUser: (user: string) => void
}

export default function Login(props: LoginProps) {
  const [phone, setPhone] = useState('')
  const [submitPhoneLogin, setSubmitPhoneLogin] = useState(false)
  const [isNumberInDB, setIsNumberInDB] = useState(false)
  const [checked, setChecked] = useState(false)

  const router = useRouter()

  const gotoShop = () => {
    router.replace('/shop')
  }

  //handles logging in with phone.
  const auth = getAuth()
  const checkIfNumberInDB = async () => {
    await fetch('/api/firebase/isPhoneNumberInDB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber: phone.trim() }),
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            setIsNumberInDB(data.isPhoneNumberInDB)
            setChecked(true)
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    submitPhoneLogin && checkIfNumberInDB()
  }, [submitPhoneLogin])
  useEffect(() => {
    const submitPhone = async () => {
      if (submitPhoneLogin === false) return
      if (submitPhoneLogin === true && isNumberInDB === true) {
        const reCaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
          },
          auth
        )
        const appVerifier = reCaptchaVerifier
        const phoneNumber = phone
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            const code = window.prompt('Enter code')
            confirmationResult
              //@ts-ignore
              .confirm(code)
              .then((result) => {
                props.setLoggedInUser(result.user.uid)
              })
              .catch(() => {
                props.setLoggedInUser('')
                alert('Error confirming code')
              })
          })
          .catch((error) => {
            alert('Error sending SMS')
            props.setLoggedInUser('')
          })
      }
    }
    submitPhone()
  }, [isNumberInDB])

  if (!props.show) {
    return <div> </div>
  } else {
    return (
      <div className={styles.loginMain}>
        <div className={styles.loginContainer}>
          <div className={styles.newUser}>
            <h1 className={styles.headerText}>New User</h1>
            <div className={styles.loginButtonWrapper}>
              <input
                type="button"
                value="REGISTER"
                onClick={gotoShop}
                className={styles.loginButton}
              />
            </div>
          </div>
          <div className={styles.divBetweenDivsDiv}>
            <div className={styles.divBetweenDivsOneTwoThree} />
            <h1 className={styles.orText}>OR</h1>
            <div className={styles.divBetweenDivsOneTwoThree} />
          </div>
          <div className={styles.returningUser}>
            <h1 className={styles.headerText}>Returning User</h1>
            <div className={styles.returningUserOptions}>
              <div className={styles.returningUserOptionTwo}>
                <input
                  id="recaptcha-container"
                  type="text"
                  placeholder="123-456-7890"
                  className={styles.returningUserInput}
                  onChange={(e) => {
                    setPhone('+1' + e.target.value)
                  }}
                  onClick={() => {
                    setSubmitPhoneLogin(false)
                  }}
                />
              </div>
              <div className={styles.loginButtonWrapper}>
                <input
                  type="button"
                  value="Sign in With Phone"
                  onClick={() => {
                    setSubmitPhoneLogin(true)
                  }}
                  className={styles.loginButton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
