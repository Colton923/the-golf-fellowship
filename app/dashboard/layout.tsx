import styles from '../../styles/Dashboard.module.css'
import Navbar from '../../components/navbar/Navbar'

export default function Layout({ children }: any) {
  return (
    <div className={styles.main}>
      <Navbar />
      <div>{children}</div>
    </div>
  )
}
