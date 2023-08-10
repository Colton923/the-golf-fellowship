'use client'

import {
  Badge,
  Chip,
  Container,
  Flex,
  Skeleton,
  Stack,
  Text,
  Title,
  Center,
  MultiSelect,
  Space,
} from '@mantine/core'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CalendarIcon from './calendarIcon/CalendarIcon'
import { Event } from '@api/sanity/getEvents'

export default function Sales() {
  const [salesData, setSalesData] = useState([])
  const playing = Math.random() > 0.5 ? true : false

  const UpdateStripeDB = async (event: Event) => {
    const res = await fetch('/api/stripe/new/sanityEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event }),
    })
    if (!res.ok) {
      throw new Error(res.statusText)
    }

    return res.json()
  }

  useEffect(() => {
    async function getEvents() {
      const res = await fetch('/api/sanity/getEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return res.json()
    }
    const DataSetter = async () => {
      const data = await getEvents()
      if (!data) return
      const goodData = data
        .filter((event: any) => {
          const eventDate = new Date(event.date)
          const today = new Date()
          if (eventDate > today) return event
        })
        .sort((a: any, b: any) => {
          const aDate = new Date(a.date) as any
          const bDate = new Date(b.date) as any
          return aDate - bDate
        })

      setSalesData(goodData)
    }
    DataSetter()
  }, [])

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
      <Center>
        <MultiSelect
          data={salesData.map((sale: any) => {
            return sale.location.description
          })}
          label="Tags"
          w={'200px'}
        />
      </Center>
      <Space h={'sm'} />
      <Stack justify="flex-start" spacing={'xs'}>
        {salesData.map((sale: any, index: number) => {
          return (
            <Link
              href={`/shop/${sale._id}`}
              key={index}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Flex direction="row" align="center" p={0} bg={'#f3f3f3'} h={'60px'}>
                <Flex w={'60px'} h={'100%'}>
                  <CalendarIcon date={sale.date} />
                </Flex>
                <Flex
                  direction="column"
                  align="flex-start"
                  justify="center"
                  ml={'sm'}
                >
                  <Title order={3} size="md">
                    {sale.title}
                  </Title>
                  <Text size="sm">{sale.location.description.toUpperCase()}</Text>
                </Flex>
                <Flex direction="column" justify="center">
                  <Text ta={'center'} ml={'xs'} mr={'xs'}>
                    {militaryTimeToStandardTime(sale.date.split('T')[1].slice(0, 5))}
                  </Text>
                </Flex>
                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    height: '100%',
                    width: '30px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text ta={'center'} ml={'xs'} mr={'xs'}>
                    {playing ? '✔️' : '❌'}
                  </Text>
                </div>
              </Flex>
            </Link>
          )
        })}
      </Stack>
    </Container>
  )
}
