'use client'

import { Card, Flex, Avatar, Badge, Text } from '@mantine/core'

interface PlayerData {
  first: string
  last: string
  id: string
  plus?: boolean
  children: React.ReactNode
}

const PlayerCard = (props: PlayerData) => {
  const { first, last, children, id, plus } = props

  return (
    <Card shadow="sm" padding="sm" radius="md" h={'85px'} w={'350px'}>
      <Flex direction="row" h={'100%'} align="center">
        <Avatar radius={'xl'} h={'35px'} w={'35px'}>
          {first.charAt(0)}
          {last.charAt(0)}
          {plus && (
            <Text size={'8px'} color="blue">
              +
            </Text>
          )}
        </Avatar>

        <Flex direction="row" align="flex-start" justify="flex-start" wrap={'wrap'}>
          {children}
        </Flex>
      </Flex>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: '3px',
          right: '3px',
        }}
      >
        <Badge color="dark" variant="filled">
          PLYR#{id}
        </Badge>
      </div>
    </Card>
  )
}

export default PlayerCard
