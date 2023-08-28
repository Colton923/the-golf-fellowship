'use client'

import { Card, Flex, Group, Text, Badge, Divider } from '@mantine/core'

import { useSiteContext } from '@components/context/Context'

const DateHelper = (date: number) => {
  const dateObj = new Date(date * 1000)
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

const Purchases = () => {
  const { purchases } = useSiteContext()
  return (
    <Flex direction={'column'} justify={'center'} p={'xs'}>
      <Text>Purchases</Text>
      {purchases.map((purchase, index) => {
        return (
          <Group key={index + 'transition-purchase'} m={'xs'}>
            <Card shadow="sm" padding="sm">
              <Flex
                justify="space-between"
                align="center"
                wrap={'wrap'}
                direction={'column'}
              >
                <Text fz={'xs'} ta={'left'}>
                  Purchased On
                </Text>
                <Text fz={'xs'} ta={'right'}>
                  {DateHelper(purchase.createdAt.seconds)}
                </Text>
                {purchase.cart.map((item, jindex) => {
                  return (
                    <Flex
                      key={index + 'purchase' + jindex + item.id}
                      p={'xs'}
                      direction={'column'}
                      justify={'flex-start'}
                      w={'100%'}
                    >
                      <Divider />

                      <Text>{item.item.event.title}</Text>
                      <Divider />

                      <Text>
                        {item.item.sideGamesSelected.length > 0 && (
                          <Text fz={'xs'} ta={'center'} mt={'xs'}>
                            Side Games
                          </Text>
                        )}
                        <Divider />
                        {item.item.sideGamesSelected.length > 0 &&
                          item.item.sideGamesSelected.map((sideGame, kindex) => {
                            return (
                              <Text
                                fz={'sm'}
                                ta={'left'}
                                key={index + jindex + 'sideGame' + kindex}
                              >
                                {sideGame}
                              </Text>
                            )
                          })}
                      </Text>
                      {item.item.playingPartner && (
                        <>
                          <Text fz={'xs'} ta={'center'} mt={'xs'}>
                            Playing Partner
                          </Text>
                          <Divider />
                          <Text fz={'sm'} ta={'left'}>
                            {item.item.playingPartner}
                          </Text>
                        </>
                      )}
                    </Flex>
                  )
                })}
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                  }}
                >
                  <Badge variant="outline" color="green">
                    ${purchase.total}
                  </Badge>
                </div>
              </Flex>
            </Card>
          </Group>
        )
      })}
    </Flex>
  )
}

export default Purchases
