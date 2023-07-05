'use client'

import styles from './Login.module.css'

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useSiteContext } from '@components/context/Context'
import {
  Container,
  Modal,
  Flex,
  Group,
  Input,
  InputBase,
  Text,
  Space,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
export default function Login() {
  const [phone, setPhone] = useState('')
  const [submitPhoneLogin, setSubmitPhoneLogin] = useState(false)
  const [isNumberInDB, setIsNumberInDB] = useState(false)
  const [checked, setChecked] = useState(false)
  const { showSignUp, loginMain, setLoggedInUser, setShowSignUp, router } =
    useSiteContext()
  const [opened, { open, close }] = useDisclosure(true)
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
  }, [showSignUp])

  return (
    <Modal
      centered
      opened={opened}
      onClose={close}
      overlayProps={{
        color: 'transparent',
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Container ref={loginMain} size={'xl'}>
        <Flex direction={'column'} justify={'space-between'}>
          <Container
            size={'xl'}
            style={{ border: '1px solid black', borderRadius: '5px' }}
          >
            <Space h={20} />
            <Text>New User Registration</Text>
            <Space h={20} />
            <Group position="center">
              <Input type="button" value="Register" onClick={gotoShop} />
            </Group>
            <Space h={20} />
          </Container>
          <Space h={20} />
          <Container
            size={'xl'}
            style={{ border: '1px solid black', borderRadius: '5px' }}
          >
            <Space h={20} />
            <Text>Returning User Sign In</Text>
            <Space h={20} />
            <Group>
              <input
                id="recaptcha-container"
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
                onClick={() => {
                  setSubmitPhoneLogin(false)
                }}
              />
            </Group>
            <Space h={20} />
            <Input
              type="button"
              value="Sign in"
              onClick={() => {
                setSubmitPhoneLogin(true)
              }}
            />
            <Space h={20} />
          </Container>
        </Flex>
      </Container>
    </Modal>
  )
}
