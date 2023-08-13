'use client'

import { Badge, Button, Card, Flex, Space, Text, Title } from '@mantine/core'
import { useSiteContext } from '@components/context/Context'

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

const Cart = () => {
  const { cart, cartOpened, RemoveItemFromCart } = useSiteContext()
  if (!cartOpened) return null
  return (
    <Flex direction="column" justify="flex-end" align="flex-end">
      {cart && cart.length > 0 ? (
        cart.map((item, index) => {
          return (
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              key={index}
              w={'100%'}
              wrap={'wrap'}
            >
              <Card shadow={'md'} m={'sm'} padding={'xs'} radius={'md'} withBorder>
                <Badge
                  color="green"
                  variant="light"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }}
                >
                  ${item.item.totalPrice}
                </Badge>
                <Title w={'100%'}>{item.item.event.title}</Title>
                {item.item.sideGamesSelected.map((sideGame) => {
                  return (
                    <Badge key={sideGame} color="dark">
                      <Text>{sideGame}</Text>
                    </Badge>
                  )
                })}
                <Text>{DateHelper(item.item.event.date)}</Text>
                <Button
                  color="dark"
                  onClick={() => {
                    if (RemoveItemFromCart) RemoveItemFromCart(item.id)
                  }}
                >
                  Remove
                </Button>
                <Space h={'10px'} />
              </Card>
            </Flex>
          )
        })
      ) : (
        <Text>Cart is empty</Text>
      )}
    </Flex>
  )
}

export default Cart
