'use client'
import DashboardNavbar from '../dashboard/DashboardNavbar'
import style from '../../styles/ProShop.module.css'
import productImage from '../../public/static/images/membershipImage.jpg'
import Image from 'next/image'

interface ProShopLayoutProps {
  children: React.ReactNode
}

export default function ProShopLayout({ children }: ProShopLayoutProps) {
  return (
    <div>
      <DashboardNavbar />
      <div className="two-column-grid">
        <div className="left-column">
          <div className="image">
            <Image src={productImage} alt="Product Image" />
          </div>
        </div>
        <div className="right-column">{children}</div>
      </div>
    </div>
  )
}
