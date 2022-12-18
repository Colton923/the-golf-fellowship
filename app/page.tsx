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
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebaseClient'
import DashboardNavbar from '../components/DashboardNavbar'

export default function Index() {
  const [user, loading, error] = useAuthState(auth)
  const [showSignupMenu, setShowSignupMenu] = useState(false);

  const displaySignupMenu = () => {
    if (showSignupMenu) {
      setShowSignupMenu(false)
    } else {
      setShowSignupMenu(true)
    }
  }

  return (
    <div className={styles.main}>
      <div>{!user ? <HomeNavbar /> : <DashboardNavbar />}</div>
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
        <h1 onClick={displaySignupMenu} className={styles.overlayButtonText}>Become a Member</h1>
      </Link>
      <div className={showSignupMenu ? styles.signupMenuCardWrapper : styles.signupMenuCardWrapperHidden}>
        <div className={styles.signupMenuCard}>
          <h3 className={styles.signupMenuCardTitle}>Sign Up</h3>
          <div className={styles.signupMenuCardFormWrapper}>
            <form className={styles.signupMenuCardForm}>
              <input className={styles.signupMenuCardFormInput} type="text" placeholder="First name" />
              <input className={styles.signupMenuCardFormInput} type="text" placeholder="Last name" />
              <input className={styles.signupMenuCardFormInput} type="email" placeholder="Email address" />
              <button className={styles.signupMenuCardFormSubmit} type="submit">Submit</button>
            </form>
          </div>
          <p>OR</p>
            <Link href="/">Sign in with Google</Link>
            <div className={styles.signupMenuCardCloseBtnWrapper}>
              <h4 onClick={displaySignupMenu} className={styles.signupMenuCardCloseBtn}>Close</h4>
            </div>
        </div>
      </div>
      <div className={styles.whoAreWeSection}>
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
