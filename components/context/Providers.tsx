'use client'
import Navbar from '@components/navbar/Navbar'
import styles from '@styles/App.module.css'

import { MantineProvider, AppShell } from '@mantine/core'
import { ContextProvider } from './Context'
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
        <div className={styles.main}>
          <Navbar />
        </div>
        {children}
      </MantineProvider>
    </ContextProvider>
  )
}

export default Providers
