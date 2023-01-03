'use client'

import Navbar from '../components/navbar/Navbar'
import styles from '../styles/App.module.css'
import Login from '../components/login/Login'

import Image from 'next/image'
import imgHome from '../public/static/images/tgf_home_page.jpg'
import imgCompete from '../public/static/images/tgf_home_page_compete.jpg'
import imgGolf from '../public/static/images/tgf_home_page_golf.jpg'
import imgImprove from '../public/static/images/tgf_home_page_improve.jpg'
import imgNetwork from '../public/static/images/tgf_home_page_network.jpg'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getDocs, getDoc, collection, doc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseClient'

type FormData = {
  firstName: string
  lastName: string
  email: string
}

const validName = RegExp(/^[A-Za-z]+$/i)

const validEmail = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

export default function Index() {
  const [showSignupMenu, setShowSignupMenu] = useState(false)
  const [focus, setFocus] = useState(false)
  const [userSubscribed, setUserSubscribed] = useState(false)
  const [user, loading, error] = useAuthState(auth)
  const [loggedInUser, setLoggedInUser] = useState('')

  const router = useRouter()

  const gotoShop = () => {
    router.replace('/shop')
  }

  const gotoDashboard = () => {
    router.replace('/dashboard')
  }

  const logout = () => {
    auth.signOut()
    showLogin()
  }

  // const consoleLogMyOrders = async () => {
  //   const customer = 'Colton923@gmail.com'
  //   await fetch('/api/stripe/customer_invoices', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ customerId: customer }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }
  // consoleLogMyOrders()

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

        //end temporary fix

        // const userRef = collection(db, 'users')
        // const docRef = doc(userRef, loggedInUser)
        // const subscriptionCol = collection(docRef, 'subscriptions')
        // await getDocs(subscriptionCol)
        //   .then((querySnapshot) => {
        //     const data = querySnapshot.docs.map((doc) => doc.data())
        //     const longest = data.reduce((a, b) =>
        //       a.current_period_end > b.current_period_end ? a : b
        //     )
        //     if (longest.current_period_end > Date.now() / 1000) {
        //       gotoDashboard()
        //     } else {
        //       alert('Your subscription has expired')
        //     }
        //   })
        // .catch(() => {
        //   alert('Please register for a subscription')
        //   logout()
        //   gotoShop()
        // })}
      } catch (error) {
        alert('Please register for a subscription')
        logout()
        gotoShop()
      }
    }
    isUserSubscribed()
  }, [loggedInUser])

  const navbarRef = useRef(null)
  const showLogin = () => {
    setShowSignupMenu(!showSignupMenu)
  }

  //This is the system for clicking off of the login component. See the ref={} arg on div wrapping componenet.
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

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const goToShop = () => {
    router.replace('/shop')
  }

  return (
    <div className={styles.main}>
      <div ref={navbarRef}>
        <Navbar showLogin={showLogin} />
      </div>
      <div ref={loginMain}>
        <Login show={showSignupMenu} setLoggedInUser={setLoggedInUser} />
      </div>
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage}>
          <Image src={imgHome} alt="Home Page" quality={100} fill />
        </div>
        <div className={styles.backgroundOverlay}>
          <h1 className={styles.overlayTitle}>PLAY + COMPETE + CONNECT </h1>
          <h2 className={styles.overlaySubTitle}>
            San Antonio, Austin, Houston & Dallas-Fort Worth
          </h2>
        </div>
      </div>
      <button className={styles.overlayButton}>
        <h1 onClick={goToShop} className={styles.overlayButtonText}>
          Become a Member
        </h1>
      </button>
      <div className={styles.whoWeAreSection}>
        <h1 className={styles.whoWeAreTitle}>WHO WE ARE</h1>
        <div className={styles.youtubeEmbedWrapper}>
          <iframe
            className={styles.youtubeEmbed}
            src="https://www.youtube.com/embed/-wYJnzg6NHo"
            title="Membership Announcement"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </div>
      <div className={styles.whatWeDoSection}>
        {/* <div className={styles.backgroundImageDallE}>
          <Image src={imgBack} fill alt="tgfBackground" />
        </div> */}
        <h1 className={styles.whatWeDoTitle}>WHAT WE DO</h1>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image src={imgGolf} alt="Golf" quality={100} fill />
            </div>
            <h2 className={styles.cardTitle}>GOLF</h2>
            <h3 className={styles.cardSubTitle}>
              REFUEL & ENJOY a Regular Schedule of Weeknight 9s & Weekend 18s on a
              Variety of Courses in Your Area & Across Texas
            </h3>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image src={imgNetwork} alt="Network" quality={100} fill />
            </div>
            <h2 className={styles.cardTitle}>NETWORK</h2>
            <h3 className={styles.cardSubTitle}>
              CONNECT & BUILD New Friendships, Personally & Professionally and Find
              Camaraderie thru Shared Experiences
            </h3>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image src={imgCompete} alt="Compete" quality={100} fill />
            </div>
            <h2 className={styles.cardTitle}>COMPETE</h2>
            <h3 className={styles.cardSubTitle}>
              EXPERIENCE the THRILL of Competition thru Gross, Net, Two Man, Team,
              Stableford, Match Play, Ryder Cup & More Formats
            </h3>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image src={imgImprove} alt="Improve" quality={100} fill />
            </div>
            <h2 className={styles.cardTitle}>IMPROVE</h2>
            <h3 className={styles.cardSubTitle}>
              DEVELOP & LEVEL UP Your Golf Skills thru Assessment, Evaluation &
              Tracking Focused on Quality Practice & Lower Scores
            </h3>
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <input
            type="button"
            value="Become a Member"
            className={styles.whatWeDoTitle}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              margin: '10px',
            }}
            onClick={() => {
              goToShop()
            }}
          ></input>
        </div>
      </div>
    </div>
  )
}
