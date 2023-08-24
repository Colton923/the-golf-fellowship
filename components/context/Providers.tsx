'use client'

import { MantineProvider } from '@mantine/core'
import { ContextProvider } from './Context'
import LayoutController from './LayoutController'
import { Notifications } from '@mantine/notifications'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: 'Open Sans, sans-serif',
        lineHeight: '1.5',
      }}
    >
      <ContextProvider>
        <Notifications />
        <LayoutController>{children}</LayoutController>
      </ContextProvider>
    </MantineProvider>
  )
}

export default Providers
