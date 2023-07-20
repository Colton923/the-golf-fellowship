'use client'

import {
  useMemo,
  memo,
  useContext,
  useState,
  useEffect,
  useRef,
  createContext,
} from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../../firebase/firebaseClient'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { notifications } from '@mantine/notifications'

type FormData = {
  firstName: string
  lastName: string
  email: string
}

const validName = RegExp(/^[A-Za-z]+$/i)

const validEmail = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

interface ContextScope {
  showSignUp: boolean
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>
  focus: boolean
  setFocus: React.Dispatch<React.SetStateAction<boolean>>
  navbarRef: React.MutableRefObject<null>
  router: any
  gotoShop: () => void
  gotoDashboard: () => void
  logout: () => void
  loginMain: React.MutableRefObject<null>
  register: any
  setValue: any
  handleSubmit: any
  errors: any
  isAdmin: boolean
  user: any
  loading: boolean
  error: any
}

export const Context = createContext<Partial<ContextScope>>({})

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSignupMenu, setShowSignupMenu] = useState(false)
  const [focus, setFocus] = useState(false)
  const [user, loading, error] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const [notified, setNotified] = useState(false) //does this execute twice in prod

  const IsAdmin = async (userId: string) => {
    const response = await fetch('/api/firebase/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: userId }),
    })
    const data = await response.json()
    setIsAdmin(data.admin)
  }

  useEffect(() => {
    if (!user) {
      setIsAdmin(false)

      if (notified) return
      setNotified(true)
      notifications.show({
        title: `Welcome.`,
        message: '',
        color: 'white',
        withCloseButton: true,
        autoClose: 6000,
      })
    } else {
      IsAdmin(user.uid)
      notifications.show({
        title: `Welcome ${user?.displayName}`,

        message: `        Thank you for being a member since ${user?.metadata.creationTime}. Your last
      login was ${user?.metadata.lastSignInTime}.
      `,
        color: 'white',
        withCloseButton: true,
        autoClose: 6000,
      })
      router.push('/dashboard')
    }
  }, [user])

  const navbarRef = useRef(null)

  const router = useRouter()

  const gotoShop = () => {
    router.replace('/shop')
  }

  const gotoDashboard = () => {
    router.replace('/dashboard')
  }

  const logout = () => {
    auth.signOut()
    setShowSignupMenu(false)
  }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const loginMain = useRef(null)

  useEffect(() => {
    const handleFocusForm = () => {
      const firstNameFocus = document.getElementById('firstName')
      firstNameFocus?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'center',
      })
      //select the first input field
      firstNameFocus?.focus()
    }
    handleFocusForm()
  }, [focus])

  const contextValue = useMemo(
    () => ({
      showSignUp: showSignupMenu,
      setShowSignUp: setShowSignupMenu,
      focus,
      setFocus,
      navbarRef,
      router,
      gotoShop,
      gotoDashboard,
      logout,
      loginMain,
      register,
      setValue,
      handleSubmit,
      errors,
      isAdmin,
      user,
      loading,
    }),
    [showSignupMenu, focus, user, router, errors, loading, isAdmin]
  )

  return (
    <Context.Provider value={contextValue as ContextScope}>
      {children}
    </Context.Provider>
  )
}

export default memo(ContextProvider)

export const useSiteContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider')
  }
  return context
}
