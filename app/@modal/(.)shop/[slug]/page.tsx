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
  Group,
  Modal,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useSiteContext } from '@components/context/Context'
import SideGamesChips from '../../../shop/[slug]/SideGamesChips'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import styles from '../../Modal.module.scss'

export type MyUserData = {
  address: {
    city: string
    country: string
    opt: string
    postalCode: string
    special: string
    state: string
    street: string
  }
  dateAdded: string
  email: string
  firstName: string
  lastName: string
  membership: {
    city: string
    plan: string
    quantity: string
    status: string
    subTerm: string
    term: string
  }
  phone: string
  stripeId: string
  stripeLink: string
  uid: string
}

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [event, setEvent] = useState<Event | null>(null)
  const { user, router, AddItemToCart } = useSiteContext()
  const [sideGamesSelected, setSideGamesSelected] = useState<string[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [locationFee, setLocationFee] = useState<number>(0)
  const [sideGamesFee, setSideGamesFee] = useState<Record<string, number>[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [myData, setMyData] = useState<MyUserData | null>(null)
  const [sanityMember, setSanityMember] = useState<any | null>(null)

  useEffect(() => {
    if (!user) return
    if (!user.uid) return
    if (myData) return
    async function getMyData(uid: string) {
      const res = await fetch('/api/firebase/myData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      })
      return res.json()
    }

    const DataSetter = async () => {
      const data = await getMyData(user.uid)
      setMyData(data)
    }
    DataSetter()
  }, [user])

  useEffect(() => {
    if (!slug) return
    if (!myData) return
    async function getEvent(slug: string) {
      if (!myData) return
      const res = await fetch('/api/sanity/getEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: slug, plan: myData.membership.plan }),
      })
      return res.json()
    }

    async function sanityMember(plan: string) {
      if (!myData) return
      const res = await fetch('/api/sanity/getSanityMembership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: plan }),
      })
      return res.json()
    }
    const sanityMembership = async () => {
      const data = await sanityMember(myData.membership.plan)
      if (!data) return
      setSanityMember(data.membership)
    }
    sanityMembership()

    const DataSetter = async () => {
      const data = await getEvent(slug)
      if (!data) return

      setEvent(data[0])
    }
    DataSetter()
  }, [myData, slug])

  useEffect(() => {
    if (!event) return
    if (!myData) {
      setLocationFee(event.location.default9Fee)
      setTotalPrice(event.location.default9Fee)
      return
    }
    let total = 0

    //Title of Event Fee document must designate how many holes the event is

    if (!event.cost.title.includes('18')) {
      total += event.location.default9Fee
      setLocationFee(event.location.default9Fee)
    } else {
      total += event.location.default18Fee
      setLocationFee(event.location.default18Fee)
    }

    //My fee as a member
    if (!sanityMember) return
    const memberFee = event.cost.feePerMembership.find((fee: any) => {
      if (fee.membership._ref === sanityMember._id) {
        return true
      }
    })

    if (memberFee) {
      total += memberFee.fee
      sanityMember.fee = memberFee.fee
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
  }, [event, sideGamesSelected, myData, sanityMember])

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
      <Center m={'xs'}>
        <Button
          onClick={() => {
            notifications.show({
              title: 'Added to Cart',
              message: '',
              color: 'dark',
              icon: '$',
              autoClose: 5000,
            })
            if (!AddItemToCart) return
            AddItemToCart(event._id)
            router.back()
          }}
          color={'dark'}
          variant={'outline'}
        >
          <Text fz={'xl'} p={'md'} ta={'right'}>
            Add to Cart
          </Text>
        </Button>
      </Center>
    )
  }

  return (
    <Modal
      opened={true}
      onClose={() => router.back()}
      size={'xl'}
      pt={'xl'}
      mt={'xl'}
    >
      <Space h={'50px'} />
      <Flex
        direction="row"
        align="flex-start"
        justify="space-evenly"
        wrap={'wrap'}
        w={'100%'}
        style={{
          zIndex: 100,
          margin: '10px',
        }}
      >
        <Button
          onClick={() => {
            router.back()
          }}
          color={'dark'}
          variant={'filled'}
          p={'xs'}
          w={'100px'}
        >
          <Text fz={'md'} p={'xs'} ta={'center'} m={0}>
            Back
          </Text>
        </Button>
        <Button
          onClick={open}
          color={'dark'}
          variant={'filled'}
          p={'xs'}
          w={'100px'}
        >
          <Text fz={'md'} p={'xs'} ta={'center'} m={0}>
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
                <Grid w={'100%'} miw={'75vw'} h={'100%'}>
                  <Grid.Col span={'auto'}>
                    <Text fz={'xs'} fw={'bolder'}>
                      TGF Fees:
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={'auto'} offset={1}>
                    <Text fz={'xs'} fw={'lighter'} color={'green'}>
                      $
                      {sanityMember ? parseInt(sanityMember.fee).toFixed(2) : '0.00'}
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
                  <Spoiler maxHeight={0} showLabel="Details" hideLabel="Hide">
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
                    <Text
                      ta={'left'}
                      w={'100%'}
                      key={'descriptionForTitle' + event.eventType.title}
                      p={'xs'}
                    >
                      {event.eventType.title}
                    </Text>
                    <Text
                      ta={'left'}
                      w={'100%'}
                      key={'descriptionFor' + event.eventType.title}
                      p={'xs'}
                    >
                      {event.eventType.description}
                    </Text>
                  </Spoiler>
                </Grid.Col>
                <Grid.Col mb={'xs'} span={'auto'}>
                  <Spoiler maxHeight={0} showLabel="Add Side Games" hideLabel="Hide">
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
                  </Spoiler>
                </Grid.Col>
                <Grid.Col>
                  <Spoiler
                    maxHeight={0}
                    showLabel="Cancellation Policy"
                    hideLabel="Hide"
                  ></Spoiler>
                </Grid.Col>
              </Grid>
            </Center>
          </Container>
        </Flex>
        <AddToCartButton />
        <Space h={'50px'} />
      </Flex>
    </Modal>
  )
}
