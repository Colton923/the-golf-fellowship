import Footer from '@components/footer/Footer'
import Navbar from '@components/navbar/Navbar'
import { AppShell } from '@mantine/core'

interface LayoutControllerProps {
  children: React.ReactNode
}

const LayoutController = (props: LayoutControllerProps) => {
  return (
    <AppShell
      navbarOffsetBreakpoint={'xs'}
      navbar={<Navbar />}
      footer={<Footer />}
      padding={0}
      fixed={false}
    >
      {props.children}
    </AppShell>
  )
}

export default LayoutController
