'use client'

import styles from '@styles/App.module.css'
import Video from '@components/video/Video'
import Image from 'next/image'
import imgCompete from '@public/static/images/tgf_home_page_compete.jpg'
import imgGolf from '@public/static/images/tgf_home_page_golf.jpg'
import imgImprove from '@public/static/images/tgf_home_page_improve.jpg'
import imgNetwork from '@public/static/images/tgf_home_page_network.jpg'
export default function Index() {
  return (
    <div>
      <div className={styles.videoWrapper}>
        <Video />
      </div>
      <div className={styles.whatWeDoSection}>
        <h1 className={styles.whatWeDoTitle}>WHAT WE DO</h1>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image
                src={imgGolf}
                alt="Golf"
                height={780}
                width={973}
                className={styles.image}
                style={{ transform: 'scale(0.42)' }}
              />
            </div>
            <h2 className={styles.cardTitle}>GOLF</h2>
            <h3 className={styles.cardSubTitle}>
              REFUEL & ENJOY a Regular Schedule of Weeknight 9s & Weekend 18s on a
              Variety of Courses in Your Area & Across Texas
            </h3>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image
                src={imgNetwork}
                alt="Network"
                quality={100}
                height={1609}
                width={1609}
                className={styles.image}
                style={{ transform: 'scale(0.2)' }}
              />
            </div>
            <h2 className={styles.cardTitle}>NETWORK</h2>
            <h3 className={styles.cardSubTitle}>
              CONNECT & BUILD New Friendships, Personally & Professionally and Find
              Camaraderie thru Shared Experiences
            </h3>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image
                src={imgCompete}
                alt="Compete"
                quality={100}
                height={811}
                width={1440}
                className={styles.image}
                style={{ transform: 'scale(0.4)' }}
              />
            </div>
            <h2 className={styles.cardTitle}>COMPETE</h2>
            <h3 className={styles.cardSubTitle}>
              EXPERIENCE the THRILL of Competition thru Gross, Net, Two Man, Team,
              Stableford, Match Play, Ryder Cup & More Formats
            </h3>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBackgroundImage}>
              <Image
                src={imgImprove}
                alt="Improve"
                quality={100}
                height={1213}
                width={1920}
                className={styles.image}
                style={{ transform: 'scale(0.3)' }}
              />
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
