import styles from '@styles/Admin.module.css'
import Navbar from '@components/navbar/Navbar'

export default function Layout({ children }: any) {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  )
}
