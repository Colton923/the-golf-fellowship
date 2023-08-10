'use client'

import Cart from '@components/cart/Cart'
import { useSiteContext } from '@components/context/Context'
import { Container, Menu, Space, Flex, Button, Modal } from '@mantine/core'

export default function Page() {
  const {
    cartOpened,
    HandleClosingCart,
    HandleOpeningCart,
    cart,
    AddItemToCart,
    RemoveItemFromCart,
  } = useSiteContext()

  if (!HandleClosingCart || !cartOpened) return null

  return (
    <Modal size={'md'} opened={cartOpened} onClose={HandleClosingCart} title="Cart">
      <Flex direction="row" justify="center" align="center" w={'100%'} wrap={'wrap'}>
        <Space h={'200px'} />
        <Button onClick={() => HandleClosingCart()} color="dark" m={'xl'}>
          Close
        </Button>
        <Cart />
      </Flex>
    </Modal>
  )
}
