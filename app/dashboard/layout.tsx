import styles from '../../styles/App.module.css'
import DashboardNavbar from './DashboardNavbar'
import Products from './Products'
export default async function Layout({ children }: any) {
  return (
    <div>
      <div className={styles.main}>
        <DashboardNavbar />
        <div className={styles.leftcontainer}>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
          <h1>Boring</h1>
        </div>
        <div className={styles.rightcontainer}>
          <div className={styles.cardwrapper}>
            <Products />
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
