'use client'

import { Text, Flex, Card, Chip, Modal, Image } from '@mantine/core'
import pricingGuide from 'public/static/images/pricingGuide.webp'
import InfoInput from './InfoInput'
import { useState } from 'react'
import { IconX } from '@tabler/icons-react'

type Props = {
  setSelectedFrequency: (frequency: string) => void
  next: () => void
  firstName: string
  selectedFrequency: string
}

const Frequency = (props: Props) => {
  const { setSelectedFrequency, next, firstName, selectedFrequency } = props
  const [pricingGuideOpen, setPricingGuideOpen] = useState(false)
  const pricingGuideHandler = () => {
    setPricingGuideOpen(!pricingGuideOpen)
  }

  return (
    <>
      {pricingGuideOpen && (
        <Modal
          opened={pricingGuideOpen}
          onClose={() => setPricingGuideOpen(false)}
          size={'md'}
          withCloseButton={false}
          withOverlay={true}
          centered
        >
          <IconX size={30} onClick={() => setPricingGuideOpen(false)} />
          <Image src={pricingGuide.src} alt={'pricing guide'}></Image>
        </Modal>
      )}

      <Card shadow="md" radius="md" p="md" m="md">
        <InfoInput handler={pricingGuideHandler} />
        <Flex direction="column" align="center" justify="center">
          <Text ta={'center'}>
            {`${firstName}, let's determine which membership is best for you.`}
          </Text>
          <Text ta={'center'}>How often do you expect to play?</Text>
          <Chip.Group>
            <Chip
              m={'xs'}
              onClick={() => {
                setSelectedFrequency('player')
                next()
              }}
              color={'dark'}
              variant={selectedFrequency === 'player' ? 'filled' : 'outline'}
            >
              {`2x's/mo. or less`}
            </Chip>
            <Chip
              m={'xs'}
              onClick={() => {
                setSelectedFrequency('plus')
                next()
              }}
              color={'dark'}
              variant={selectedFrequency === 'plus' ? 'filled' : 'outline'}
            >
              {`3x's/mo. or more`}
            </Chip>{' '}
            <Chip
              m={'xs'}
              onClick={() => {
                setSelectedFrequency('notsure')
                next()
              }}
              color={'dark'}
              variant={selectedFrequency === 'notsure' ? 'filled' : 'outline'}
            >
              {`Not sure`}
            </Chip>
          </Chip.Group>
        </Flex>
      </Card>
    </>
  )
}

export default Frequency
