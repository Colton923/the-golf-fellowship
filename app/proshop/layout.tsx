import Navbar from '../../components/navbar/Navbar'
import styles from '../../styles/ProShop.module.css'

export default function ProShopLayout({ children }: any) {
  return (
    <div className={styles.pageWrap}>
      <Navbar />
      <div>{children}</div>
    </div>
  )
}
