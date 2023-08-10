'use client'

import { useSiteContext } from '@components/context/Context'
import Sales from '@components/sales/Sales'
import { Container, Menu, Space, Text, Button } from '@mantine/core'
export default function Page() {
  const { user, loading, error, router } = useSiteContext()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return (
      <Container size={'xl'} p={'xl'} m={'xl'} mih={'100vh'}>
        <Space h={'100px'} />
        <Sales />
      </Container>
    )
  } else {
    router.push('/membership')
    return null
  }
}
