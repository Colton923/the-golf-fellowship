'use client'

import styles from './Login.module.css'

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useSiteContext } from '@components/context/Context'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [submitPhoneLogin, setSubmitPhoneLogin] = useState(false)
  const [isNumberInDB, setIsNumberInDB] = useState(false)
  const [checked, setChecked] = useState(false)
  const { showSignUp, loginMain, setLoggedInUser, setShowSignUp, router } =
    useSiteContext()

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
                if (setLoggedInUser) setLoggedInUser(result.user.uid)
              })
              .catch(() => {
                if (setLoggedInUser) setLoggedInUser('')
                alert('Error confirming code')
              })
          })
          .catch((error) => {
            alert('Error sending SMS')
            if (setLoggedInUser) setLoggedInUser('')
          })
      }
    }
    submitPhone()
  }, [isNumberInDB])

  useEffect(() => {
    const HandleClickBackgroundCover = (e: any) => {
      if (e.target.className === styles.backgroundCover) {
        if (setShowSignUp) setShowSignUp(false)
      }
    }
    window.addEventListener('click', HandleClickBackgroundCover)
    return () => {
      window.removeEventListener('click', HandleClickBackgroundCover)
    }
  }, [])

  if (!showSignUp) {
    return null
  } else {
    return (
      <>
        <div className={styles.backgroundCover} />
        <div className={styles.loginMain} ref={loginMain}>
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
                    type="tel"
                    placeholder="123-456-7890"
                    className={styles.returningUserInput}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9,-]/g, '')
                      if (e.target.value.length > 12) {
                        e.target.value = e.target.value.slice(0, 12)
                      }
                      if (e.target.value.length === 3) {
                        if (e.target.value[2] !== '-') {
                          e.target.value = e.target.value + '-'
                        }
                      }
                      if (e.target.value.length === 7) {
                        if (e.target.value[6] !== '-') {
                          e.target.value = e.target.value + '-'
                        }
                      }
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
      </>
    )
  }
}
