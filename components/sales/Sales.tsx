'use client'

import {
  Container,
  Flex,
  Skeleton,
  Stack,
  Text,
  Title,
  Card,
  ThemeIcon,
} from '@mantine/core'
import Link from 'next/link'
import CalendarIcon from './calendarIcon/CalendarIcon'
import { useSiteContext } from '@components/context/Context'
import { useState } from 'react'
import { Event } from '@api/sanity/getEvents'
import { IconCheck } from '@tabler/icons-react'

export default function Sales() {
  const [selectedSale, setSelectedSale] = useState<number | null>(null)
  const { HandleIveBoughtThatBefore } = useSiteContext()
  const salesData = HandleIveBoughtThatBefore()

  if (!salesData) {
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
      <Text
        fz={'xl'}
        weight={700}
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          paddingBottom: '10px',
        }}
      >
        TGF Events
      </Text>
      <Stack justify="flex-start" spacing={'xs'} w={'100%'} mt={'xs'}>
        {salesData.map((sale: Event, index: number) => {
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
              <Card shadow="sm" padding={0} radius="md">
                <Flex w={'100%'} direction="row" align="center" p={0} h={'60px'}>
                  <Flex w={'60px'} h={'100%'}>
                    <CalendarIcon
                      date={new Date(sale.date)}
                      color={sale.userOwns ? 'green' : 'black'}
                    />
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

                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                    flexDirection: 'column',
                  }}
                >
                  {sale.userOwns && (
                    <ThemeIcon color="green" size="xs">
                      <IconCheck />
                    </ThemeIcon>
                  )}
                  {sale.cost.title.includes('9') ? (
                    <ThemeIcon color="blue" size="xs">
                      <Text fz={'xs'}>{'9'}</Text>
                    </ThemeIcon>
                  ) : (
                    <Flex align="center" justify="center" direction="row">
                      <ThemeIcon color="blue" size="xs">
                        <Text fz={'xs'}>{'18'}</Text>
                      </ThemeIcon>
                    </Flex>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </Stack>
    </Container>
  )
}
