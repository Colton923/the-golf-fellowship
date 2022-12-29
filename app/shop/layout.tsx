import Navbar from '../../components/navbar/Navbar'
import styles from '../../styles/Shop.module.css'

export default function ShopLayout({ children }: any) {
  return (
    <div className={styles.pageWrap}>
      <Navbar />
      <div>{children}</div>
    </div>
  )
}
