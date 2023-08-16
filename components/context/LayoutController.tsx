import DashboardNav from '@components/dashboardNav/DashboardNav'
import Footer from '@components/footer/Footer'
import Navbar from '@components/navbar/Navbar'
import { AppShell } from '@mantine/core'

interface LayoutControllerProps {
  children: React.ReactNode
}

const LayoutController = (props: LayoutControllerProps) => {
  return (
    <AppShell
      navbar={<Navbar />}
      footer={<Footer />}
      aside={<DashboardNav />}
      padding={0}
      fixed={false}
    >
      {props.children}
    </AppShell>
  )
}

export default LayoutController
