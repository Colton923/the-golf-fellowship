'use client'

import { Flex, Container, Card, Space } from '@mantine/core'
import { cardData } from '@components/homepageCards/static'
import Video from '@components/video/Video'
import CarouselComponent from '@components/carousel/CarouselComponent'
import Locations from '@components/locations/Locations'
import Cards from '@components/homepageCards/Cards'
import styles from '@styles/App.module.scss'

export default function Index() {
  return (
    <Flex
      direction="column"
      align={'center'}
      justify={'center'}
      className={styles.main}
      style={{
        maxWidth: '100vw',
      }}
    >
      <Flex
        direction="column"
        align={'flex-start'}
        justify={'flex-start'}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 1)', // this gives the overlay
          width: '100%',
          padding: '0',
          margin: '0 auto 0 auto',
          overflow: 'hidden',
        }}
      >
        <Container
          p={0}
          m={0}
          miw={'100vw'}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // this gives the overlay
            backdropFilter: 'blur(35px)',
          }}
        >
          <CarouselComponent />
        </Container>
        <Container p={0} w={'100%'} maw={'100%'}>
          <Card
            shadow={'md'}
            radius={0}
            bg={'black'}
            p={0}
            style={{
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <Flex
              direction={'row'}
              align={'space-evenly'}
              justify={'space-evenly'}
              wrap={'wrap'}
              h={'100%'}
              w={'100%'}
              bg={'black'}
              m={0}
              p={'xs'}
            >
              <Video />
              <Locations />
              <Space h={'10px'} />
            </Flex>
          </Card>
        </Container>
        <Flex
          direction="row"
          wrap="wrap"
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Cards cardData={cardData} />
        </Flex>
      </Flex>
    </Flex>
  )
}
