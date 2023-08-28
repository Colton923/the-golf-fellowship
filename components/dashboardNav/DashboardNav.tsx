'use client'

import {
  IconHome,
  IconList,
  IconSettings,
  IconShoppingCart,
  IconUser,
  IconUserCancel,
} from '@tabler/icons-react'
import { Flex, Stack, Text, ThemeIcon, Space, Modal } from '@mantine/core'
import { useSiteContext } from '@components/context/Context'

const DashboardNav = () => {
  const {
    isAdmin,
    dashboardToggle,
    openDashboardNavigation,
    HandleDashboard,
    logout,
  } = useSiteContext()

  return (
    <Modal
      opened={openDashboardNavigation}
      size={'100%'}
      onClose={() => {
        dashboardToggle()
      }}
      fullScreen
    >
      <Flex align={'stretch'} w={'100%'} p={'xl'} direction={'column'}>
        <Space h={'100px'} />
        <Stack spacing={'xl'} align="stretch" h={'65vh'}>
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
        <Flex
          justify={'space-evenly'}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            logout()
          }}
        >
          <ThemeIcon size={'md'} color="dark" variant={'outline'}>
            <IconUserCancel />
          </ThemeIcon>
          <Text
            style={{
              padding: '0 10px',
              margin: '0 10px',
            }}
            miw={'200px'}
            ta={'left'}
          >
            Logout
          </Text>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default DashboardNav
