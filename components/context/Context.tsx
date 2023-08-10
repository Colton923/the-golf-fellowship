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
import { usePathname } from 'next/navigation'
import { useDisclosure } from '@mantine/hooks'
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
  AddItemToCart: (id: string) => void
  RemoveItemFromCart: (id: string) => void
  cart: Cart[]
  HandleClosingCart: () => void
  HandleOpeningCart: () => void
  error: any
  cartOpened: boolean
}

export type Cart = {
  id: string
  quantity: number
}
export const Context = createContext<Partial<ContextScope>>({})

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSignupMenu, setShowSignupMenu] = useState(false)
  const [focus, setFocus] = useState(false)
  const [user, loading, error] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const [notified, setNotified] = useState(false) //does this execute twice in prod
  const [cart, setCart] = useState<Cart[]>([])
  const [cartOpened, { open, close }] = useDisclosure(false)

  const pathname = usePathname()

  const router = useRouter()

  const navbarRef = useRef(null)

  const loginMain = useRef(null)

  const gotoShop = () => {
    router.replace('/shop')
  }

  const gotoDashboard = () => {
    router.push('/dashboard')
  }

  const logout = () => {
    auth.signOut()
    setShowSignupMenu(false)
    router.refresh()
  }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const IsAdminCheck = async (userId: string) => {
    const response = await fetch('/api/firebase/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: userId }),
    })
    const data = await response.json()
    setIsAdmin(data.admin)
    return data.admin
  }

  const AddItemToCart = (id: string) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([...cart, { id, quantity: 1 }])
    }
  }

  const RemoveItemFromCart = (id: string) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      )
    } else {
      setCart([...cart, { id, quantity: 1 }])
    }
  }

  const HandleOpeningCart = () => {
    if (user) {
      open()
    } else {
      notifications.show({
        title: `Please login to view your cart.`,
        message: `You will be redirected to membership purchasing.`,
        color: 'white',
        withCloseButton: true,
        autoClose: 6000,
      })
      router.push('/shop')
    }
  }

  const HandleClosingCart = () => {
    close()
  }

  useEffect(() => {
    if (notified || !user) return
    const notify = async () => {
      setNotified(true)

      const admin = await IsAdminCheck(user.uid)

      if (pathname === '/') {
        if (admin) {
          notifications.show({
            title: `Welcome Admin ${user?.displayName}`,
            message: `Redirecting you to dashboard.`,
            color: 'white',
            withCloseButton: true,
            autoClose: 6000,
          })
          router.push('/dashboard')
        } else {
          notifications.show({
            title: `Welcome ${user?.displayName}`,
            message: `Thank you for being a member since ${user?.metadata.creationTime}. Your last
              login was ${user?.metadata.lastSignInTime}. Redirecting you to your dashboard.
              `,
            color: 'white',
            withCloseButton: true,
            autoClose: 6000,
          })
        }
      }
    }
    notify()
  }, [user])

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
      AddItemToCart,
      RemoveItemFromCart,
      cart,
      HandleClosingCart,
      HandleOpeningCart,
      cartOpened,
      error,
    }),
    [
      showSignupMenu,
      HandleClosingCart,
      HandleOpeningCart,
      focus,
      user,
      router,
      errors,
      cartOpened,
      loading,
      isAdmin,
      cart,
      error,
      handleSubmit,
      loginMain,
      logout,
      navbarRef,
      register,
      setValue,
      gotoDashboard,
      gotoShop,
      AddItemToCart,
      RemoveItemFromCart,
    ]
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
