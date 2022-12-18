'use client'

import HomeNavbar from '../components/HomeNavbar'
import styles from '../styles/App.module.css'
import Image from 'next/image'
import imgHome from '../public/static/images/tgf_home_page.jpg'
import imgCompete from '../public/static/images/tgf_home_page_compete.jpg'
import imgGolf from '../public/static/images/tgf_home_page_golf.jpg'
import imgImprove from '../public/static/images/tgf_home_page_improve.jpg'
import imgNetwork from '../public/static/images/tgf_home_page_network.jpg'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebaseClient'
import DashboardNavbar from '../components/DashboardNavbar'
import imgBack from '../public/static/images/background.png'
import { useCallback } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { useForm } from 'react-hook-form'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import googleLogo from '../public/static/images/googleLogo.png'

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
  const [user, loading, error] = useAuthState(auth)
  const [showSignupMenu, setShowSignupMenu] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const router = useRouter()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const db = getFirestore()

  const signInWithGoogle = async (data: FormData) => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userRef = collection(db, 'users')
      const docRef = doc(userRef, result.user.uid)
      await setDoc(docRef, {
        userTypedFirstName: data.firstName,
        userTypedLastName: data.lastName,
        userTypedEmail: data.email,
        uid: result.user.uid,
        googleAccountFirstName: result.user.displayName
          ? result.user.displayName?.split(' ')[0]
          : data.firstName,
        googleAccountLastName: result.user.displayName
          ? result.user.displayName?.split(' ')[1]
          : data.lastName,
        email: result.user.email,
        photoUrl: result.user.photoURL,
      })
      router.push('/dashboard')
    } catch (error) {
      console.log(error)
      alert('Error signing in with Google')
    }
    setValue('lastName', '')
    setValue('firstName', '')
    setValue('email', '')
  }

  const wrapperSetShowSignupMenu = useCallback(
    (showSignupMenu: boolean) => {
      setShowSignupMenu(showSignupMenu)
    },
    [setShowSignupMenu]
  )

  const displaySignupMenu = () => {
    if (showSignupMenu) {
      setShowSignupMenu(false)
    } else {
      setShowSignupMenu(true)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (
        event.target &&
        (event.target as HTMLElement).className === styles.main &&
        (event.target as HTMLElement).className !== styles.signupMenuCardWrapper &&
        showSignupMenu === true
      ) {
        setShowSignupMenu(false)
      }
    }
    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [showSignupMenu])

  return (
    <div className={styles.main}>
      <div>
        {!user ? (
          <HomeNavbar showSignupMenuSetter={wrapperSetShowSignupMenu} />
        ) : (
          <DashboardNavbar />
        )}
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
      <Link href="/" className={styles.overlayButton}>
        <h1 onClick={displaySignupMenu} className={styles.overlayButtonText}>
          Become a Member
        </h1>
      </Link>

      <div
        className={
          showSignupMenu
            ? styles.signupMenuCardWrapper
            : styles.signupMenuCardWrapperHidden
        }
      >
        <form onSubmit={handleSubmit(signInWithGoogle)}>
          <div className={styles.signupMenuCard}>
            <h3 className={styles.signupMenuCardTitle}>
              Welcome to The Golf Fellowship
            </h3>
            <div className={styles.signupMenuCardFormWrapper}>
              <input
                className={styles.signupMenuCardFormInput}
                type="text"
                placeholder="First name"
                {...register('firstName', {
                  maxLength: 20,
                  required: true,
                  validate: (value) =>
                    validName.test(value) || 'First name must contain only letters',
                })}
              />
              <input
                className={styles.signupMenuCardFormInput}
                type="text"
                placeholder="Last name"
                {...register('lastName', {
                  maxLength: 20,
                  required: true,
                  validate: (value) =>
                    validName.test(value) || 'Last name must contain only letters',
                })}
              />
              <input
                className={styles.signupMenuCardFormInput}
                type="email"
                placeholder="Email address"
                {...register('email', {
                  required: true,
                  validate: (value) =>
                    validEmail.test(value) || 'E-mail must be valid',
                })}
              />
              <button className={styles.signupMenuCardFormSubmit} type="submit">
                Submit
              </button>
            </div>
            <div className={styles.orWrapper}>
              <div className={styles.lineBetweenOrDivs1234}></div>
              <p>or</p>
              <div className={styles.lineBetweenOrDivs5678}></div>
            </div>
            <button
              type="submit"
              value="Sign In"
              className={styles.signupMenuCardFormSubmitGoogle}
            >
              <Image
                src={googleLogo}
                alt="Google Logo"
                height={75}
                width={75}
                className={styles.googleLogoWrapper}
              />
            </button>
            <div className={styles.signupMenuCardCloseBtnWrapper}>
              <h4
                onClick={displaySignupMenu}
                className={styles.signupMenuCardCloseBtn}
              >
                Close
              </h4>
            </div>
          </div>
        </form>
      </div>
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
      </div>
    </div>
  )
}
