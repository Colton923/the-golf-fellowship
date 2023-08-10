'use client'

import { MantineProvider } from '@mantine/core'
import { ContextProvider } from './Context'
import LayoutController from './LayoutController'
import { Notifications } from '@mantine/notifications'
import Cart from '@components/cart/Cart'
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ContextProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'Open Sans, sans-serif',
          lineHeight: '1.5',
        }}
      >
        <Notifications />
        <LayoutController>{children}</LayoutController>
        <Cart />
      </MantineProvider>
    </ContextProvider>
  )
}

export default Providers
