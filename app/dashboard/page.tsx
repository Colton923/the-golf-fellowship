import styles from '../../styles/Dashboard.module.css'
import Products from './Products'

export default function Page() {
  return (
    <div className={styles.main}>
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
  )
}
