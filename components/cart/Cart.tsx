'use client'

import { Button, Card, Center, Drawer, Flex, Text } from '@mantine/core'
import { useSiteContext } from '@components/context/Context'

const Cart = () => {
  const {
    cart,
    AddItemToCart,
    cartOpened,
    RemoveItemFromCart,
    user,
    HandleClosingCart,
    HandleOpeningCart,
    error,
    router,
  } = useSiteContext()

  const close = () => {
    if (HandleClosingCart) HandleClosingCart()
  }

  if (!cartOpened) return null
  return (
    <Drawer
      opened={cartOpened}
      onClose={close}
      padding="md"
      size="md"
      title="Cart"
      position="bottom"
      shadow="xl"
      withOverlay
      withCloseButton
      zIndex={1000}
    >
      <Flex direction="column" justify="center" align="center">
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
                    onClick={() => {
                      if (RemoveItemFromCart) RemoveItemFromCart(item.id)
                    }}
                  >
                    Remove
                  </Button>
                </Card>
              </Flex>
            )
          })
        ) : (
          <Text>Cart is empty</Text>
        )}
      </Flex>
    </Drawer>
  )
}

export default Cart
