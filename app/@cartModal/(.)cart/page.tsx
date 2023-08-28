'use client'

import Cart from '@components/cart/Cart'
import { useSiteContext } from '@components/context/Context'
import { Flex, Button, Modal } from '@mantine/core'
import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import EventCheckoutForm from './EventCheckoutForm'

export default function Page() {
  const {
    cartOpened,
    HandleClosingCart,
    user,
    cartTotal,
    clientSecret,
    clientStripe,
  } = useSiteContext()
  const [checkingOut, setCheckingOut] = useState(false)

  const options = {
    clientSecret: clientSecret,
    appearance: {
      /*...*/
    },
  }

  return (
    <Modal
      yOffset={'20vh'}
      opened={cartOpened}
      onClose={HandleClosingCart}
      title={`Total: $${cartTotal}`}
    >
      {checkingOut && clientStripe && options && user && cartTotal && (
        <Elements stripe={clientStripe} options={options}>
          <EventCheckoutForm cartTotal={cartTotal} user={user} />
        </Elements>
      )}
      {!checkingOut && (
        <>
          <Flex
            direction="row"
            justify="center"
            align="center"
            w={'100%'}
            wrap={'wrap'}
          >
            <Cart />
          </Flex>
          <Button
            color="dark"
            variant="filled"
            mt={'xs'}
            style={{
              display: 'flex',
              position: 'sticky',
              width: '100%',
              bottom: '0',
              left: '0',
              right: '0',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => {
              setCheckingOut(true)
            }}
          >
            Checkout
          </Button>
        </>
      )}
    </Modal>
  )
}
