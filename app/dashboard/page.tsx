'use client'
import Image from 'next/image'
import imgBackground from '@public/static/images/tgf_dashboard_background.png'
import styles from '@styles/Dashboard.module.css'
import GolferSVG from '@components/svgs/golfer'

import { CalendarComponent } from '@components/calendar/Calendar'
import { Account } from '@components/account/Account'
import { Receipts } from '@components/data/Receipts'
import { useSiteContext } from '@components/context/Context'
import { BackgroundImage, Center, Container, Flex, Tabs } from '@mantine/core'

const svg1 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.toggleIcon}
    >
      <path d="M18 15L12 9 6 15"></path>
    </svg>
  )
}

const svg2 = () => {
  return (
    <svg viewBox="0 0 512 512">
      <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" />
    </svg>
  )
}

const svg3 = () => {
  return (
    <svg viewBox="0 0 448 512">
      <path d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z" />
    </svg>
  )
}

export default function Page() {
  const { isAdmin, user, router } = useSiteContext()

  if (!user) {
    return router.replace('/')
  } else {
    return (
      <BackgroundImage src={imgBackground.src}>
        <Flex direction="column" align="center" justify="center">
          <Container size="xl" mih={'100vh'} mt={'200px'} miw={'80vw'}>
            <Tabs defaultValue={'stats'}>
              <Tabs.List>
                <Tabs.Tab value="stats" icon={<GolferSVG />}>
                  Statistics
                </Tabs.Tab>
                <Tabs.Tab value="account" icon={<GolferSVG />}>
                  My Account
                </Tabs.Tab>
                <Tabs.Tab value="calendar" icon={<GolferSVG />}>
                  Calendar
                </Tabs.Tab>
                {isAdmin && (
                  <Tabs.Tab value="admin" icon={<GolferSVG />}>
                    Admin
                  </Tabs.Tab>
                )}
              </Tabs.List>
              <Tabs.Panel value="stats">Statistics</Tabs.Panel>
              <Tabs.Panel value="account">My Account</Tabs.Panel>
              <Tabs.Panel value="calendar">
                <Center p={'sm'}>
                  <CalendarComponent />
                </Center>
              </Tabs.Panel>
              {isAdmin && (
                <Tabs.Panel value="admin">
                  <Center p={'sm'}>
                    <Receipts />
                  </Center>
                </Tabs.Panel>
              )}
            </Tabs>
          </Container>
        </Flex>
      </BackgroundImage>
    )
  }
}
