'use client'

import type { Event } from '@api/sanity/getEvents'
import {
  Flex,
  Grid,
  Text,
  Center,
  Container,
  Skeleton,
  Spoiler,
  Button,
  ScrollArea,
  Modal,
  TextInput,
  Image,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useSiteContext } from '@components/context/Context'
import SideGamesChips from '@components/cart/SideGamesChips'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import styles from 'styles/Modal.module.scss'
import urlFor from 'lib/sanity/urlFor'

export interface CartItem {
  sideGamesSelected: string[]
  locationFee: number
  sideGamesFee: Record<string, number>[]
  totalPrice: number
  event: Event
  playingPartner: string
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

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [event, setEvent] = useState<Event | null>(null)
  const { myUserData, router, AddItemToCart, sanityMember, salesData } =
    useSiteContext()
  const [sideGamesSelected, setSideGamesSelected] = useState<string[]>([])
  const [totalBreakdown, { open: openTotalBreakdown, close: closeTotalBreakdown }] =
    useDisclosure(false)
  const [locationFee, setLocationFee] = useState<number>(0)
  const [sideGamesFee, setSideGamesFee] = useState<Record<string, number>[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [playingPartner, setPlayingPartner] = useState<string>('')

  useEffect(() => {
    if (!salesData) return
    const event = salesData.find((event: Event) => event._id === slug)
    if (event) {
      setEvent(event)
    }
  }, [slug, salesData])

  useEffect(() => {
    if (!event) {
      return
    } else {
      setLocationFee(event.location.default9Fee)
      setTotalPrice(event.location.default9Fee)
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
  }, [event, sideGamesSelected, sanityMember])

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
            if (!AddItemToCart || !event) return
            AddItemToCart({
              sideGamesSelected,
              locationFee,
              sideGamesFee,
              totalPrice,
              event,
              playingPartner,
            })
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

  if (!event) return null

  return (
    <Modal
      opened={true}
      onClose={() => router.back()}
      fullScreen={false}
      className={styles.modal}
      yOffset={'20vh'}
      title={event.title}
    >
      <Center className={styles.modalContent}>
        <Modal opened={totalBreakdown} onClose={closeTotalBreakdown} fullScreen>
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
                        {sanityMember
                          ? parseInt(sanityMember.fee).toFixed(2)
                          : '0.00'}
                      </Text>
                    </Grid.Col>
                  </Grid>
                  {sideGamesFee &&
                    sideGamesFee.map((sideGame, index) => {
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
        </Modal>
        <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
          <Center>
            {event.image ? (
              <Image
                src={urlFor(event.image).url()}
                alt={event.title}
                width={120}
                height={120}
              />
            ) : (
              <Skeleton height={120} width={120} />
            )}
          </Center>
          <Flex direction={'column'} align={'center'} justify={'center'} p={'md'}>
            <Text fw={100} fz={'xs'}>
              {DateHelper(event.date)}
            </Text>
            <Text fw={100} fz={'xs'}>
              {event.location.title}
            </Text>
          </Flex>
          <Flex direction={'column'} align={'center'} justify={'center'} p={'md'}>
            {event.description &&
              event.description.map((desc, index) => {
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
          </Flex>
          <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
            <Container p={0} m={0}>
              <Center m={0}>
                <Flex direction="row" align="center" justify="center" wrap={'wrap'}>
                  <Spoiler
                    maxHeight={0}
                    ta={'center'}
                    showLabel="Details"
                    hideLabel="Hide"
                  >
                    {event.inclusions &&
                      event.inclusions.map((inclusion, index) => {
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
                  <Spoiler
                    maxHeight={0}
                    showLabel="Add Side Games"
                    hideLabel="Hide"
                    ta={'center'}
                  >
                    <Flex
                      direction="row"
                      align="flex-start"
                      justify="flex-start"
                      wrap={'wrap'}
                      m={'lg'}
                    >
                      <SideGamesChips
                        event={event}
                        sideGamesSelected={sideGamesSelected}
                        setSideGamesSelected={setSideGamesSelected}
                      />
                    </Flex>
                  </Spoiler>
                  {event.playingPartnerRequest && (
                    <Spoiler
                      maxHeight={0}
                      showLabel={
                        playingPartner === ''
                          ? 'Playing Partner Request'
                          : `${playingPartner}`
                      }
                      ta={'center'}
                      hideLabel="Enter"
                    >
                      <Flex
                        direction="row"
                        align="center"
                        justify="center"
                        wrap={'wrap'}
                      >
                        <TextInput
                          placeholder={'Kerry Niester'}
                          label={'Playing Partner Request'}
                          value={playingPartner}
                          onChange={(e) => {
                            if (e.target.value.length < playingPartner.length) {
                              setPlayingPartner('')
                              return
                            }
                            setPlayingPartner(e.target.value)
                          }}
                        />
                      </Flex>
                    </Spoiler>
                  )}
                </Flex>
              </Center>
            </Container>
          </Flex>
          <AddToCartButton />
          <Button
            onClick={openTotalBreakdown}
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
      </Center>
    </Modal>
  )
}
