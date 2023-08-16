'use client'

import Image from 'next/image'
import imgBackground from '@public/static/images/tgf_dashboard_background.png'
import styles from '@styles/Dashboard.module.css'
import GolferSVG from '@components/svgs/golfer'

import { CalendarComponent } from '@components/calendar/Calendar'
import Account from '@components/account/Account'
import { Receipts } from '@components/data/Receipts'
import { useSiteContext } from '@components/context/Context'
import {
  BackgroundImage,
  Center,
  Container,
  Flex,
  Badge,
  Tabs,
  Title,
  Space,
} from '@mantine/core'
import Sales from '@components/sales/Sales'
import { Suspense } from 'react'
import Purchases from '@components/account/myPurchases/Purchases'
import { useEffect, useState } from 'react'
import PlayerCard from '@components/playerCard/PlayerCard'
export default function Page() {
  const { dashboardActiveComponents, isAdmin, user, myUserData } = useSiteContext()
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    if (myUserData) {
      setDisplayName(`${myUserData?.firstName} ${myUserData?.lastName}`)
    } else {
      if (!user) return
      if (user.displayName) {
        setDisplayName(user.displayName)
      } else if (user.email) {
        setDisplayName(user.email)
      } else if (user.phoneNumber) {
        setDisplayName(user.phoneNumber)
      }
    }
  }, [user, myUserData])

  return (
    <Container bg={'light'}>
      <Space h={'100px'} />
      <Flex pt={'xl'} direction="column" align="center" justify="center">
        <PlayerCard
          first={myUserData?.firstName || 'A'}
          last={myUserData?.lastName || 'A'}
          id={myUserData?.uid.slice(0, 6) || ''}
          plus={myUserData?.membership.plan === 'plus' ? true : false}
        >
          <Flex align="center" justify="center" wrap={'wrap'} p={'xs'}>
            {myUserData?.membership.city && (
              <Badge m={'1px'} color="light" variant="outline">
                {myUserData?.membership.city}
              </Badge>
            )}
            {myUserData?.membership.plan && (
              <Badge m={'1px'} color="light" variant="outline">
                {myUserData?.membership.plan}
              </Badge>
            )}
          </Flex>
        </PlayerCard>
        <Container size="xl" mih={'100vh'} miw={'80vw'} p={'xs'}>
          {dashboardActiveComponents?.includes('proShop') && <Sales />}
          {dashboardActiveComponents?.includes('purchases') && <Purchases />}
          {dashboardActiveComponents?.includes('account') && <Account />}
          {dashboardActiveComponents?.includes('admin') && isAdmin && <Receipts />}
        </Container>
      </Flex>
    </Container>
  )
}
