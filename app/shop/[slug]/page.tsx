'use client'

import type { Event } from '@api/sanity/getEvents'
import {
  Flex,
  Grid,
  Space,
  Text,
  Center,
  Title,
  Container,
  Card,
  Skeleton,
  Spoiler,
  Button,
  Drawer,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useSiteContext } from '@components/context/Context'
import SideGamesChips from './SideGamesChips'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [event, setEvent] = useState<Event | null>(null)
  const { user } = useSiteContext()
  const [sideGamesSelected, setSideGamesSelected] = useState<string[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [locationFee, setLocationFee] = useState<number>(0)
  const [sideGamesFee, setSideGamesFee] = useState<Record<string, number>[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  console.log('user', user)

  useEffect(() => {
    async function getEvent(slug: string) {
      const res = await fetch('/api/sanity/getEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })
      return res.json()
    }

    const DataSetter = async () => {
      const data = await getEvent(slug)
      setEvent(data[0])
    }
    DataSetter()
  }, [])

  useEffect(() => {
    if (!event) return
    let total = 0

    //Title of Event Fee document must designate how many holes the event is

    if (!event.cost.title.includes('18')) {
      total += event.location.default9Fee
      setLocationFee(event.location.default9Fee)
    } else {
      total += event.location.default18Fee
      setLocationFee(event.location.default18Fee)
    }

    sideGamesSelected.forEach((sideGame) => {
      const sideGameObj = event.sideGames.find(
        (sideGameObj) => sideGameObj.title === sideGame
      )
      if (sideGameObj) {
        total += sideGameObj.fee
        setSideGamesFee([...sideGamesFee, { [sideGame]: sideGameObj.fee }])
      }
    })

    setTotalPrice(total)
  }, [event, sideGamesSelected])

  if (!event) {
    return <div>404</div>
  }

  const DateHelper = (date: string) => {
    const dateObj = new Date(date)
    const day = dateObj.getDate()
    const month = dateObj.getMonth()
    const year = dateObj.getFullYear()
    const threeLetterMonths = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${threeLetterMonths[month].toUpperCase()} ${day}, ${year}`
  }

  const CheckoutButton = () => {
    return (
      <Button
        onClick={() => {
          notifications.show({
            title: 'Redirecting to checkout...',
            message: '',
            color: 'dark',
            icon: '$',
            autoClose: 5000,
          })
        }}
        color={'dark'}
        variant={'outline'}
      >
        <Text fz={'xl'} p={'md'} ta={'right'}>
          Checkout
        </Text>
      </Button>
    )
  }

  return (
    <Container w={'100%'} m={0} p={0} mih={'100vh'}>
      <Space h={'100px'} />
      <Card shadow={'md'} m={'sm'} padding={'xs'} radius={'md'} withBorder>
        <Flex w={'100%'} m={0} p={0} justify={'flex-end'}>
          <Button onClick={open} color={'dark'} variant={'outline'}>
            <Text fz={'xl'} p={'md'} ta={'right'}>
              ${totalPrice.toFixed(2)}
            </Text>
          </Button>
        </Flex>
        <Drawer opened={opened} onClose={close} position={'bottom'} color="dark">
          <Flex
            direction="column"
            align={'center'}
            justify={'space-between'}
            wrap={'wrap'}
          >
            <Grid w={'100%'}>
              <Grid.Col span={3}>
                <Text>Green Fees:</Text>
              </Grid.Col>
              <Grid.Col span={3} offset={3}>
                ${locationFee.toFixed(2)}
              </Grid.Col>
            </Grid>
            {sideGamesFee.map((sideGame, index) => {
              const key = Object.keys(sideGame)[0]
              const value = Object.values(sideGame)[0]
              return (
                <Grid key={'sideGame' + index} w={'100%'}>
                  <Grid.Col span={3}>
                    <Text>{key}</Text>
                  </Grid.Col>
                  <Grid.Col span={3} offset={3}>
                    ${value.toFixed(2)}
                  </Grid.Col>
                </Grid>
              )
            })}
            <Text>Total: ${totalPrice.toFixed(2)}</Text>
            <CheckoutButton />
          </Flex>
        </Drawer>
        <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
          <Center>
            <Skeleton height={120} width={120} />
          </Center>
          <Center>
            <Title ta={'center'} p={'xs'}>
              {event.title}
            </Title>
          </Center>
          <Text fw={100} fz={'xs'}>
            {DateHelper(event.date)}
          </Text>
          {`  |  `}
          <Text fw={100} fz={'xs'}>
            {event.location.title}
          </Text>
          <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
            <Container
              style={{
                padding: '0 10px',
              }}
            >
              <Center>
                <Grid>
                  <Grid.Col>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      wrap={'wrap'}
                    >
                      {event.description.map((desc, index) => {
                        return (
                          <Text
                            w={'100%'}
                            p={0}
                            ta={'center'}
                            key={'eventDesc' + index}
                            fw={100}
                            fz={'xs'}
                            fs={'italic'}
                            m={0}
                          >
                            {desc}
                          </Text>
                        )
                      })}
                      <Spoiler
                        maxHeight={110}
                        showLabel="show extras"
                        hideLabel="hide"
                      >
                        {event.inclusions.map((inclusion, index) => {
                          return (
                            <Text
                              ta={'left'}
                              w={'100%'}
                              key={'eventInclus' + index}
                              p={'xs'}
                            >
                              {inclusion}
                            </Text>
                          )
                        })}
                      </Spoiler>
                    </Flex>
                  </Grid.Col>
                  <Grid.Col>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      wrap={'wrap'}
                    >
                      <SideGamesChips
                        event={event}
                        sideGamesSelected={sideGamesSelected}
                        setSideGamesSelected={setSideGamesSelected}
                      />
                    </Flex>
                  </Grid.Col>
                </Grid>
              </Center>
            </Container>
          </Flex>
        </Flex>
        <CheckoutButton />
      </Card>
    </Container>
  )
}
