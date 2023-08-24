import { AppShell } from '@mantine/core'
import { Suspense, lazy } from 'react'

interface LayoutControllerProps {
  children: React.ReactNode
}

const LayoutController = (props: LayoutControllerProps) => {
  const Navbar = lazy(() => import('@components/navbar/Navbar'))
  const Footer = lazy(() => import('@components/footer/Footer'))
  const DashboardNav = lazy(() => import('@components/dashboardNav/DashboardNav'))

  return (
    <AppShell
      navbar={
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      }
      footer={
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      }
      aside={
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardNav />
        </Suspense>
      }
      padding={0}
      fixed={false}
    >
      {props.children}
    </AppShell>
  )
}

export default LayoutController
