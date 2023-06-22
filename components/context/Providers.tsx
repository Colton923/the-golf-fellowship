'use client'

import { MantineProvider } from '@mantine/core'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        fontFamily: 'Open Sans, sans-serif',
        lineHeight: '1.5',
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default Providers
