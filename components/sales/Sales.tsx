'use client'

import {
  Container,
  Flex,
  Skeleton,
  Stack,
  Text,
  Title,
  Space,
  Card,
} from '@mantine/core'
import Link from 'next/link'
import CalendarIcon from './calendarIcon/CalendarIcon'
import { useSiteContext } from '@components/context/Context'
import { useState } from 'react'

export default function Sales() {
  const [selectedSale, setSelectedSale] = useState<number | null>(null)
  const { salesData } = useSiteContext()

  if (salesData.length === 0) {
    return (
      <Container w={300}>
        <Skeleton height={300} />
      </Container>
    )
  }

  const militaryTimeToStandardTime = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    const minute = time.split(':')[1]
    if (hour > 12) {
      return `${hour - 12}:${minute} PM`
    } else {
      return `${hour}:${minute} AM`
    }
  }

  return (
    <Container w={'100%'} p={'xs'}>
      <Text>Pro Shop</Text>
      <Stack justify="flex-start" spacing={'xs'} w={'100%'}>
        {salesData.map((sale: any, index: number) => {
          return (
            <Link
              href={`/shop/${sale._id}`}
              key={index}
              onClick={() => {
                setSelectedSale(index)
                setTimeout(() => {
                  setSelectedSale(null)
                }, 1000)
              }}
              style={
                selectedSale === index
                  ? {
                      textDecoration: 'none',
                      color: 'rgba(0,0,0,0.5)',
                    }
                  : {
                      textDecoration: 'none',
                      color: 'inherit',
                    }
              }
            >
              <Card shadow="sm" padding={0} radius="md" withBorder>
                <Flex w={'100%'} direction="row" align="center" p={0} h={'60px'}>
                  <Flex w={'60px'} h={'100%'}>
                    <CalendarIcon date={sale.date} />
                  </Flex>
                  <Flex
                    direction="column"
                    align="flex-start"
                    justify="center"
                    ml={'sm'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Title order={3} size="md">
                      {sale.title}
                    </Title>
                    <Text size="sm">{sale.location.description.toUpperCase()}</Text>
                  </Flex>
                  <Flex w={'100%'} direction="column" justify="center">
                    <Text ta={'center'} ml={'xs'} mr={'xs'}>
                      {militaryTimeToStandardTime(
                        sale.date.split('T')[1].slice(0, 5)
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Link>
          )
        })}
      </Stack>
    </Container>
  )
}
