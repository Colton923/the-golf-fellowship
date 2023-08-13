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
import { Event } from '@api/sanity/getEvents'
import type { CartItem } from 'app/@modal/(.)shop/[slug]/page'
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
  AddItemToCart: (newItem: CartItem) => void
  RemoveItemFromCart: (id: string) => void
  cart: Cart[]
  HandleClosingCart: () => void
  cartTotal: number
  HandleOpeningCart: () => void
  error: any
  cartOpened: boolean
  salesData: any
  sanityMember: any
  myUserData: MyUserData
}

export type Cart = {
  item: CartItem
  quantity: number
  id: string
}
export type MyUserData = {
  address: {
    city: string
    country: string
    opt: string
    postalCode: string
    special: string
    state: string
    street: string
  }
  dateAdded: string
  email: string
  firstName: string
  lastName: string
  membership: {
    city: string
    plan: string
    quantity: string
    status: string
    subTerm: string
    term: string
  }
  phone: string
  stripeId: string
  stripeLink: string
  uid: string
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
  const [salesData, setSalesData] = useState([])
  const [sanityMember, setSanityMember] = useState<any | null>(null)
  const [myUserData, setMyUserData] = useState<MyUserData | null>(null)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartHash, setCartHash] = useState(0)
  const UpdateStripeDB = async (event: Event) => {
    const res = await fetch('/api/stripe/new/sanityEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event }),
    })
    if (!res.ok) {
      throw new Error(res.statusText)
    }

    return res.json()
  }

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

  const AddItemToCart = (newItem: CartItem) => {
    setCartHash(cartHash + 1)
    setCart([...cart, { item: newItem, quantity: 1, id: cartHash.toString() }])
  }

  const RemoveItemFromCart = (id: string) => {
    const item = cart.find((item) => item.id === id)
    if (!item) {
      return
    } else if (item.quantity <= 1) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      setCart(
        cart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1, id: item.id }
            : item
        )
      )
    }
  }

  const HandleOpeningCart = () => {
    if (user) {
      open()
      router.push('/cart')
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
    async function getEvents() {
      const res = await fetch('/api/sanity/getEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return res.json()
    }
    const DataSetter = async () => {
      const data = await getEvents()
      if (!data) return
      const goodData = data
        .filter((event: any) => {
          const eventDate = new Date(event.date)
          const today = new Date()
          if (eventDate > today) return event
        })
        .sort((a: any, b: any) => {
          const aDate = new Date(a.date) as any
          const bDate = new Date(b.date) as any
          return aDate - bDate
        })

      setSalesData(goodData)
    }
    DataSetter()

    async function sanityMember() {
      if (!user) return
      if (!user.uid) return
      if (myUserData) return
      async function getMyData(uid: string) {
        const res = await fetch('/api/firebase/myData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        })
        return res.json()
      }
      const data = await getMyData(user.uid)
      setMyUserData(data)
      async function getSanityMembership(plan: string) {
        const res = await fetch('/api/sanity/getSanityMembership', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan: plan }),
        })
        return res.json()
      }
      const sanitydata = await getSanityMembership(data.membership.plan)
      setSanityMember(sanitydata.membership)
    }

    sanityMember()

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

  useEffect(() => {
    let total = 0
    cart.forEach((item) => {
      total += item.quantity * item.item.totalPrice
    })

    setCartTotal(total)
  }, [cart])

  const contextValue = useMemo(
    () => ({
      showSignUp: showSignupMenu,
      setShowSignUp: setShowSignupMenu,
      focus,
      setFocus,
      navbarRef,
      cartTotal,
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
      sanityMember,
      salesData,
      error,
      myUserData,
    }),
    [
      myUserData,
      salesData,
      showSignupMenu,
      HandleClosingCart,
      HandleOpeningCart,
      focus,
      user,
      sanityMember,
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
      cartTotal,
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
