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
  ScrollArea,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useSiteContext } from '@components/context/Context'
import SideGamesChips from './SideGamesChips'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [event, setEvent] = useState<Event | null>(null)
  const { user, router } = useSiteContext()
  const [sideGamesSelected, setSideGamesSelected] = useState<string[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [locationFee, setLocationFee] = useState<number>(0)
  const [sideGamesFee, setSideGamesFee] = useState<Record<string, number>[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

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

    sideGamesSelected.map((sideGame) => {
      const sideGameFee = event.sideGames.find(
        (sideGameObj) => sideGameObj.title === sideGame
      )
      if (sideGameFee) {
        total += sideGameFee.fee
      }
    })

    const sideGamesFee = event.sideGames
      .filter((sideGame) => sideGamesSelected.includes(sideGame.title))
      .map((sideGame) => {
        return { [sideGame.title]: sideGame.fee }
      })

    setSideGamesFee(sideGamesFee)

    setTotalPrice(total)
  }, [event, sideGamesSelected])

  if (!event) {
    return null
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

  const AddToCartButton = () => {
    return (
      <Button
        onClick={() => {
          notifications.show({
            title: 'Added to Cart',
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
          Add to Cart
        </Text>
      </Button>
    )
  }

  return (
    <Container w={'100%'} m={0} p={0} mih={'100vh'}>
      <Space h={'100px'} />
      <Card shadow={'md'} m={'sm'} padding={'xs'} radius={'md'} withBorder>
        <Flex w={'100%'} m={'xs'} p={'xs'} justify={'flex-end'}>
          <Button onClick={open} color={'dark'} variant={'filled'}>
            <Text fz={'xl'} p={'md'} ta={'right'}>
              ${totalPrice.toFixed(2)}
            </Text>
          </Button>
        </Flex>
        <Drawer opened={opened} onClose={close} position={'bottom'}>
          <Flex
            direction="column"
            align={'center'}
            justify={'space-between'}
            wrap={'wrap'}
          >
            <Flex
              direction="column"
              align={'center'}
              justify={'space-between'}
              wrap={'wrap'}
            >
              <Container w={'100%'} m={0} p={0} mah={'400px'} mih={'300px'}>
                <ScrollArea h={'300px'} w={'100%'} type="scroll">
                  <Grid w={'100%'} miw={'75vw'} h={'100%'}>
                    <Grid.Col span={'auto'}>
                      <Text fz={'xs'} fw={'bolder'}>
                        Greens Fees:
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={'auto'} offset={1}>
                      <Text fz={'xs'} fw={'lighter'} color={'green'}>
                        ${locationFee.toFixed(2)}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  {sideGamesFee.map((sideGame, index) => {
                    const key = Object.keys(sideGame)[0]
                    const value = Object.values(sideGame)[0]
                    return (
                      <Grid
                        key={'sideGame' + index}
                        w={'100%'}
                        miw={'75vw'}
                        h={'100%'}
                      >
                        <Grid.Col span={'auto'}>
                          <Text fz={'xs'} fw={'bolder'}>
                            {key}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={'auto'} offset={1}>
                          <Text fz={'xs'} fw={'lighter'} color={'green'}>
                            ${value.toFixed(2)}
                          </Text>
                        </Grid.Col>
                      </Grid>
                    )
                  })}
                </ScrollArea>
              </Container>
            </Flex>
            <Flex direction="row" align={'center'} justify={'flex-end'}>
              <Container m={'xs'} p={'xs'}>
                <Text fw={'bolder'} fz={'md'}>
                  Total:
                </Text>
                <Text fw={'lighter'} color={'green'} fz={'md'}>
                  ${totalPrice.toFixed(2)}
                </Text>
              </Container>
              <AddToCartButton />
            </Flex>
          </Flex>
        </Drawer>
        <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
          <Center>
            <Skeleton height={120} width={120} />
          </Center>
          <Flex direction={'column'} align={'center'} justify={'center'}>
            <Center>
              <Title ta={'center'} p={'xs'}>
                {event.title}
              </Title>
            </Center>
            <Text fw={100} fz={'xs'}>
              {DateHelper(event.date)}
            </Text>
            <Text fw={100} fz={'xs'}>
              {event.location.title}
            </Text>
          </Flex>
          {event.description.map((desc, index) => {
            return (
              <Text
                w={'100%'}
                p={0}
                ta={'center'}
                key={'eventDesc' + index}
                fw={'bolder'}
                fz={'xs'}
                m={0}
              >
                {desc}
              </Text>
            )
          })}
          <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
            <Container
              style={{
                padding: '0 10px',
              }}
            >
              <Center>
                <Grid justify="space-between" p={'xs'} m={'xs'}>
                  <Grid.Col mb={'xs'} span={'auto'}>
                    <Spoiler maxHeight={110} showLabel="show more" hideLabel="hide">
                      <Center>
                        <Title
                          mb={'sm'}
                          fz={'md'}
                          ta={'center'}
                          underline
                          w={'100%'}
                        >
                          Details
                        </Title>
                      </Center>
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
                  </Grid.Col>
                  <Grid.Col mb={'xs'} span={'auto'}>
                    <Center>
                      <Title mb={'sm'} fz={'md'} ta={'center'} underline w={'100%'}>
                        Add Side Games
                      </Title>
                    </Center>
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
        <AddToCartButton />
      </Card>
    </Container>
  )
}
