'use client'

import { Flex, Center, Container, Title, Space } from '@mantine/core'
import { IconHammer } from '@tabler/icons-react'

export default function Page() {
  return (
    <Container mih={'100vh'} mt={'xl'} p={'xl'} bg={'dark'}>
      <Flex justify="center" align="center" direction="column" wrap={'wrap'}>
        <Space h="lg" />
        <Center>
          <IconHammer color="white" size={256} />
        </Center>
        <Space h="lg" />
        <Center>
          <Title color="white" order={1}>
            Page Under Construction
          </Title>
        </Center>
        <Space h="lg" />
      </Flex>
    </Container>
  )
}
