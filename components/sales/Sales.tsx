'use client'

import {
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
import Link from 'next/link'
import CalendarIcon from './calendarIcon/CalendarIcon'
import { useSiteContext } from '@components/context/Context'

export default function Sales() {
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
              </Flex>
            </Link>
          )
        })}
      </Stack>
    </Container>
  )
}
