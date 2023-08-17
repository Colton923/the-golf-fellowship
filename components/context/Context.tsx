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
import { auth, db } from '../../firebase/firebaseClient'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { notifications } from '@mantine/notifications'
import { usePathname } from 'next/navigation'
import { useDisclosure } from '@mantine/hooks'
import { Event } from '@api/sanity/getEvents'
import type { CartItem } from 'app/@storeModal/(.)shop/[slug]/page'
import type { Stripe } from '@stripe/stripe-js'
import { Timestamp, collection, getDocs } from 'firebase/firestore'
import initializeStripe from 'stripe/initializeStripe'
type FormData = {
  firstName: string
  lastName: string
  email: string
}

export type NewPurchase = {
  cart: Cart[]
  createdAt: Timestamp
  total: number
  uid: string
}
type dashboardSubRoutes = 'proshop' | 'purchases' | 'account' | 'receipts' | ''

export type newPurchaseResponse = {
  success: boolean
  message: string
}

const validName = RegExp(/^[A-Za-z]+$/i)

const validEmail = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

interface ContextScope {
  showSignUp: boolean
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>
  pathname: string
  focus: boolean
  setFocus: React.Dispatch<React.SetStateAction<boolean>>
  checkoutFees: number
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
  HandleDashboard: (dashboardComponent: dashboardSubRoutes) => void
  loading: boolean
  AddItemToCart: (newItem: CartItem) => void
  RemoveItemFromCart: (id: string) => void
  cart: Cart[]
  HandleClosingCart: () => void
  cartTotal: number
  HandleOpeningCart: () => void
  error: any
  cartOpened: boolean
  salesData: Event[]
  sanityMember: any
  myUserData: MyUserData
  HandleUserPurchase: (data: NewPurchase) => Promise<newPurchaseResponse>
  clientSecret: string
  clientStripe: Stripe | null
  purchases: NewPurchase[]
  HandleIveBoughtThatBefore: () => Event[]
  openDashboardNavigation: boolean
  dashboardToggle: () => void
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
  const [salesData, setSalesData] = useState<Event[]>([])
  const [sanityMember, setSanityMember] = useState<any | null>(null)
  const [myUserData, setMyUserData] = useState<MyUserData | null>(null)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartHash, setCartHash] = useState(0)
  const [checkoutFees, setCheckoutFees] = useState(0)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntent, setPaymentIntent] = useState('')
  const [clientStripe, setClientStripe] = useState<Stripe | null>(null)
  const [purchases, setPurchases] = useState<NewPurchase[]>([])
  const [openDashboardNavigation, { toggle: dashboardToggle }] = useDisclosure(false)
  const [cartOpened, { open, close }] = useDisclosure(false)

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

  const HandleUserPurchase = async (data: NewPurchase) => {
    const res = await fetch('/api/firebase/newPurchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const response: newPurchaseResponse = await res.json()

    notifications.show({
      title: response.success ? `Success!` : `Error`,
      message: response.message,
      color: 'white',
      withCloseButton: true,
      autoClose: 6000,
    })

    if (response.success) {
      gotoDashboard()
    }

    return response
  }

  const HandleIveBoughtThatBefore = () => {
    const goodData = salesData.map((event) => {
      purchases.map((purchase) => {
        purchase.cart.map((item) => {
          if (event._id === item.item.event._id) {
            event.userOwns = true
          }
        })
      })
      return event
    })
    return goodData
  }

  const HandleDashboard = (dashboardComponent: dashboardSubRoutes) => {
    if (!dashboardToggle) return
    if (dashboardComponent === '') {
      router.push('/dashboard')
      dashboardToggle()
      return
    }
    if (!pathname) return
    if (pathname.includes(dashboardComponent)) {
      router.push('/dashboard')
    } else {
      router.push(`/dashboard?component=${dashboardComponent}`)
    }
    dashboardToggle()
  }

  useEffect(() => {
    if (!user) return
    const unsubscribe = async () => {
      await getDocs(collection(db, 'users', user.uid, 'purchases')).then(
        (snapshot) => {
          const purchases: NewPurchase[] = []
          snapshot.forEach((doc) => {
            purchases.push(doc.data() as NewPurchase)
          })
          setPurchases(purchases)
        }
      )
    }

    if (purchases.length === 0) {
      unsubscribe()
    }

    async function clientStripeSetter() {
      const stripe = await initializeStripe()
      setClientStripe(stripe as Stripe | null)
    }
    if (!clientStripe) {
      clientStripeSetter()
    }
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
      if (salesData.length === 0) {
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
      return
    }

    if (!myUserData) {
      sanityMember()
    }

    const notify = async () => {
      setNotified(true)

      const admin = await IsAdminCheck(user.uid)

      if (pathname === '/') {
        if (admin) {
          notifications.show({
            title: `Welcome Admin ${myUserData?.firstName || ''}`,
            message: `Redirecting you to dashboard.`,
            color: 'white',
            withCloseButton: true,
            autoClose: 6000,
          })
        } else {
          notifications.show({
            title: `Welcome ${myUserData?.firstName || ''}`,
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
    if (!notified) {
      notify()
      if (pathname !== '/dashboard') {
        gotoDashboard()
      }
    }
  }, [user])

  useEffect(() => {
    if (cart.length === 0) {
      setCartTotal(0)
      return
    }
    let total = 0
    cart.forEach((item) => {
      total += item.quantity * item.item.totalPrice
    })
    setCartTotal(total)
  }, [cart])

  useEffect(() => {
    if (!myUserData) return
    if (cartTotal === 0) return
    const PaymentSetter = async () => {
      await fetch('api/stripe/stripe_intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal * 100,
          customer: myUserData.stripeId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.client_secret), setPaymentIntent(data.id)
        })
    }
    PaymentSetter()
  }, [myUserData, cartTotal])

  const contextValue = useMemo(
    () => ({
      showSignUp: showSignupMenu,
      setShowSignUp: setShowSignupMenu,
      focus,
      setFocus,
      navbarRef,
      clientStripe,
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
      pathname,
      cart,
      HandleClosingCart,
      checkoutFees,
      HandleOpeningCart,
      cartOpened,
      sanityMember,
      salesData,
      purchases,
      error,
      myUserData,
      HandleUserPurchase,
      openDashboardNavigation,
      HandleDashboard,
      dashboardToggle,
      HandleIveBoughtThatBefore,
      clientSecret,
    }),
    [
      myUserData,
      openDashboardNavigation,
      dashboardToggle,
      salesData,
      showSignupMenu,
      pathname,
      HandleDashboard,
      HandleClosingCart,
      HandleIveBoughtThatBefore,
      HandleOpeningCart,
      focus,
      checkoutFees,
      user,
      sanityMember,
      HandleUserPurchase,
      clientStripe,
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
      purchases,
      setValue,
      gotoDashboard,
      gotoShop,
      AddItemToCart,
      cartTotal,
      RemoveItemFromCart,
      clientSecret,
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
