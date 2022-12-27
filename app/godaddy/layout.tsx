import styles from '../../styles/GoDaddy.module.css'
import Navbar from '../../components/navbar/Navbar'

export default function Layout({ children }: any) {
  return (
    <div className={styles.main}>
      {/* @ts-ignore */}
      <Navbar />
      <div>{children}</div>
    </div>
  )
}
