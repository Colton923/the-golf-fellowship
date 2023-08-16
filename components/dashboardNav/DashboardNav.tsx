'use client'

import {
  IconHome,
  IconList,
  IconSettings,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react'
import { Flex, Stack, Text, Drawer, ThemeIcon, Space } from '@mantine/core'
import { useSiteContext } from '@components/context/Context'
import { Suspense } from 'react'
import { usePathname } from 'next/navigation'

type dashboardSubRoutes = 'proshop' | 'purchases' | 'account' | 'receipts' | ''

const DashboardNav = () => {
  const { router, isAdmin, dashboardToggle, openDashboardNavigation } =
    useSiteContext()
  const pathname = usePathname()

  const HandleDashboard = (dashboardComponent: dashboardSubRoutes) => {
    if (!dashboardToggle) return
    if (dashboardComponent === '') {
      router.push('/dashboard')
      dashboardToggle()
      return
    }
    if (!pathname) return
    if (pathname.includes(dashboardComponent)) {
      router.push('/dashboard')
    } else {
      router.push(`/dashboard?component=${dashboardComponent}`)
    }
    dashboardToggle()
  }

  if (!openDashboardNavigation) return null
  if (!dashboardToggle) return null
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Drawer
        opened={openDashboardNavigation}
        position="left"
        size={'300px'}
        onClose={dashboardToggle}
        transitionProps={{ duration: 1000 }}
        keepMounted
      >
        <Flex align={'center'} w={'100%'} p={'xl'}>
          <Space h={'300px'} />
          <Stack spacing={'xl'} align="stretch">
            <Flex
              justify={'space-evenly'}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                HandleDashboard('')
              }}
            >
              <ThemeIcon size={'md'} color="dark" variant={'outline'}>
                <IconHome />
              </ThemeIcon>
              <Text
                style={{
                  padding: '0 10px',
                  margin: '0 10px',
                }}
                miw={'200px'}
                ta={'left'}
              >
                Home
              </Text>
            </Flex>

            <Flex
              justify={'space-evenly'}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                HandleDashboard('proshop')
              }}
            >
              <ThemeIcon size={'md'} color="dark" variant="outline">
                <IconShoppingCart />
              </ThemeIcon>
              <Text
                style={{
                  padding: '0 10px',
                  margin: '0 10px',
                }}
                miw={'200px'}
                ta={'left'}
              >
                Pro Shop
              </Text>
            </Flex>
            <Flex
              justify={'space-evenly'}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                HandleDashboard('purchases')
              }}
            >
              <ThemeIcon size={'md'} color="dark" variant={'outline'}>
                <IconList />
              </ThemeIcon>
              <Text
                style={{
                  padding: '0 10px',
                  margin: '0 10px',
                }}
                miw={'200px'}
                ta={'left'}
              >
                Purchases
              </Text>
            </Flex>
            <Flex
              justify={'space-evenly'}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                HandleDashboard('account')
              }}
            >
              <ThemeIcon size={'md'} color="dark" variant={'outline'}>
                <IconUser />
              </ThemeIcon>
              <Text
                style={{
                  padding: '0 10px',
                  margin: '0 10px',
                }}
                miw={'200px'}
                ta={'left'}
              >
                Account
              </Text>
            </Flex>
            {isAdmin && (
              <Flex
                justify={'space-evenly'}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  HandleDashboard('receipts')
                }}
              >
                <ThemeIcon size={'md'} color="dark" variant={'outline'}>
                  <IconSettings />
                </ThemeIcon>
                <Text
                  style={{
                    padding: '0 10px',
                    margin: '0 10px',
                  }}
                  miw={'200px'}
                  ta={'left'}
                >
                  Admin
                </Text>
              </Flex>
            )}
          </Stack>
        </Flex>
      </Drawer>
    </Suspense>
  )
}

export default DashboardNav
