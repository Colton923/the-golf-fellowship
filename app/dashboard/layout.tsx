import styles from '../../styles/App.module.css'
import DashboardNavbar from './DashboardNavbar'

export default async function Layout({ children }: any) {
  return (
    <div>
      <div className={styles.main}>
        <DashboardNavbar />
      </div>
      <div>{children}</div>
    </div>
  )
}
