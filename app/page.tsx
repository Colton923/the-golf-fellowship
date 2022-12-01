import HomeNavbar from '../components/HomeNavbar'
import styles from '../styles/App.module.css'

export default function Index() {
  return (
    <div>
      <div className={styles.main}>
        <HomeNavbar />
      </div>
      <div>
        <h1>The Home Page</h1>
      </div>
    </div>
  )
}
