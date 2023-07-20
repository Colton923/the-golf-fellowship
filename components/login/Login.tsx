'use client'

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { useState } from 'react'
import { useSiteContext } from '@components/context/Context'
import { Modal, Flex, Input, Space, Center, Notification } from '@mantine/core'
import { auth } from '../../firebase/firebaseClient'

type LoginProps = {
  opened: boolean
  close: () => void
}

export default function Login(props: LoginProps) {
  const { opened, close } = props
  const [phone, setPhone] = useState('')
  const { setLoggedInUser, router } = useSiteContext()
  const [showNotification, setShowNotification] = useState(false)
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult>()
  const gotoShop = () => {
    router.replace('/shop')
    close()
  }
  const [codeLetters, setCodeLetters] = useState(['', '', '', '', '', ''])

  const checkIfNumberInDB = async () => {
    return await fetch('/api/firebase/isPhoneNumberInDB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber: phone.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isPhoneNumberInDB) {
          return true
        } else {
          return false
        }
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }

  const submitPhone = async () => {
    const isNumberInDB = await checkIfNumberInDB()
    if (!isNumberInDB) return alert('Phone number not found in database')
    const appVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      auth
    )
    const phoneNumber = phone
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setShowNotification(true)
        setConfirmResult(confirmationResult)
      })
      .catch((error) => {
        console.log(error)
        if (error.code === 'auth/too-many-requests') {
          alert('Too many requests. Please wait a few minutes before trying again.')
        } else {
          alert('Error sending code')
        }
        if (setLoggedInUser) setLoggedInUser('')
      })
  }
  const submitCode = (code: string) => {
    console.log(code)
    confirmResult
      ?.confirm(code)
      .then((result) => {
        if (setLoggedInUser) setLoggedInUser(result.user.uid)
      })
      .catch(() => {
        if (setLoggedInUser) setLoggedInUser('')
        alert('Error confirming code')
      })
  }

  return (
    <Modal.Root centered opened={opened} onClose={close}>
      <Modal.Overlay blur={5} bg={'rgba(80, 80, 80, 0.9)'} />
      <Modal.Content
        bg={'linear-gradient(45deg, rgba(255,255,255,1), rgba(255,255,255,0.87))'}
      >
        <Modal.CloseButton />
        <Flex p={'xs'} direction={'column'} justify={'flex-end'}>
          <Center>
            <Input
              type="tel"
              placeholder="123-456-7890"
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
              style={{
                boxShadow: '2px 2px 10px 0px rgba(0,0,0,0.2)',
                borderRadius: '0.25rem',
                textAlign: 'center',
              }}
            />
          </Center>
          <Space h={10} />
          <Center>
            <Input
              type="button"
              value="Sign in"
              onClick={() => {
                if (phone.length !== 14) {
                  alert('Please enter a valid phone number')
                  return
                }
                submitPhone()
              }}
              style={{
                boxShadow: '2px 2px 10px 0px rgba(0,0,0,0.2)',
                borderRadius: '0.25rem',
                textDecoration: 'underline',
              }}
            />
          </Center>
        </Flex>
        <Center m={'xs'}>
          <div
            style={{
              textDecoration: 'underline',
              backgroundColor: 'transparent',
              color: 'black',
            }}
            onClick={gotoShop}
          >
            New TGF Members Click Here
          </div>
        </Center>
        <Space h={10} />
        {showNotification && (
          <Notification
            onClose={() => {
              setShowNotification(false)
            }}
            title={'Enter the 6 digit pin that was sent to your phone number.'}
            color="white"
            style={{
              backgroundColor: 'rgb(100, 100, 100)',
              bottom: '0',
              position: 'fixed',
              width: '100%',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <Flex direction={'row'} align={'center'} justify={'center'}>
              {codeLetters.map((letter, index) => {
                return (
                  <Input
                    type="text"
                    id={'code-letter-' + index}
                    key={'code-letter-' + index}
                    value={letter}
                    onChange={(e) => {
                      const newCodeLetters = [...codeLetters]
                      newCodeLetters[index] = e.target.value
                      setCodeLetters(newCodeLetters)
                      if (e.target.value.length === 1 && index < 5) {
                        const nextInput = document.getElementById(
                          'code-letter-' + (index + 1)
                        )
                        if (nextInput) nextInput.focus()
                      }
                      if (e.target.value.length === 0 && index > 0) {
                        const prevInput = document.getElementById(
                          'code-letter-' + (index - 1)
                        )
                        if (prevInput) prevInput.focus()
                      }
                      if (e.target.value.length === 1 && index === 5) {
                        submitCode(codeLetters.join('') + e.target.value)
                        setShowNotification(false)
                        close()
                      }
                    }}
                    style={{
                      boxShadow: '2px 2px 10px 0px rgba(0,0,0,0.2)',
                      borderRadius: '0.25rem',
                      textAlign: 'center',
                      width: '2rem',
                      height: '2rem',
                      margin: '0.25rem',
                      fontSize: '1.5rem',
                    }}
                  />
                )
              })}
            </Flex>
            <Space h={10} />
          </Notification>
        )}
      </Modal.Content>
    </Modal.Root>
  )
}
