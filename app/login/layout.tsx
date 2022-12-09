import React from 'react'
import HomeNavbar from '../../components/HomeNavbar'
import styles from '../../styles/App.module.css'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <div className={styles.main}>
        <HomeNavbar />
      </div>
      <section>{children}</section>
    </div>
  )
}
