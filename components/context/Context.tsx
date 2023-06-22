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
import { useRouter } from 'next/router'
import { auth } from '../../firebase/firebaseClient'
import { useForm } from 'react-hook-form'

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
  loggedInUser: string
  setLoggedInUser: React.Dispatch<React.SetStateAction<string>>
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
  goToShop: () => void
}

export const Context = createContext<Partial<ContextScope>>({})

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSignupMenu, setShowSignupMenu] = useState(false)
  const [focus, setFocus] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState('')

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

  const goToShop = () => {
    router.replace('/shop')
  }

  const loginMain = useRef(null)
  const handleClickOffLoginMain = (e: any) => {
    if (
      loginMain.current &&
      //@ts-ignore
      !loginMain.current.contains(e.target) &&
      //@ts-ignore
      !navbarRef.current.contains(e.target)
    ) {
      setShowSignupMenu(false)
    }
  }

  useEffect(() => {
    const isUserSubscribed = async () => {
      if (loggedInUser === '') return
      try {
        alert('Checking subscription status...')

        //temporary fix for subscription check
        if (loggedInUser !== '') {
          gotoDashboard()
        } else {
          alert('Please register for a subscription')
          logout()
          gotoShop()
        }
      } catch (error) {
        alert('Please register for a subscription')
        logout()
        gotoShop()
      }
    }
    isUserSubscribed()
  }, [loggedInUser])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOffLoginMain)
    return () => {
      document.removeEventListener('mousedown', handleClickOffLoginMain)
    }
  }, [])

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
      loggedInUser,
      setLoggedInUser,
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
      goToShop,
    }),
    [showSignupMenu, focus, loggedInUser, router, errors]
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
