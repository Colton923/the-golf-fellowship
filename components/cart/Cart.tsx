'use client'

import { Affix, Button, Card, Center, Flex, Space, Text } from '@mantine/core'
import { useSiteContext } from '@components/context/Context'

const Cart = () => {
  const { cart, cartOpened, RemoveItemFromCart } = useSiteContext()

  if (!cartOpened) return null
  return (
    <Affix
      position={{
        bottom: 0,
        right: 0,
      }}
    >
      <Flex
        direction="column"
        justify="flex-end"
        align="flex-end"
        miw={'350px'}
        mih={'600px'}
      >
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
                  <Text>{item.id}</Text>
                  <Text>{item.quantity}</Text>
                  <Button
                    color="dark"
                    onClick={() => {
                      if (RemoveItemFromCart) RemoveItemFromCart(item.id)
                    }}
                  >
                    Remove
                  </Button>
                  <Space h={'10px'} />
                  <Center>
                    <Button color="dark" variant="outline">
                      Checkout
                    </Button>
                  </Center>
                </Card>
              </Flex>
            )
          })
        ) : (
          <Text>Cart is empty</Text>
        )}
      </Flex>
    </Affix>
  )
}

export default Cart
