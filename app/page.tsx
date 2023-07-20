'use client'

import Video from '@components/video/Video'

import {
  Flex,
  Container,
  Card,
  Collapse,
  Center,
  Space,
  Overlay,
} from '@mantine/core'
import CarouselComponent from '@components/carousel/CarouselComponent'
import Locations from '@components/locations/Locations'
import Cards from '@components/homepageCards/Cards'
import { cardData } from '@components/homepageCards/static'
import { useDisclosure } from '@mantine/hooks'

export default function Index() {
  const [opened, { toggle }] = useDisclosure(false)
  const [openedVideo, { toggle: toggleVideo }] = useDisclosure(false)

  return (
    <Flex
      direction="column"
      align={'center'}
      justify={'center'}
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
            style={{ width: '100%', maxWidth: '100%' }}
          >
            {/* <Button
              variant="light"
              color="gray"
              onClick={async () => {
                // test post endpoint
                await fetch('/api/sanity/postEvent', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ testData1 }),
                }).then(async (res) => {
                  const data = await res.json()
                  console.log(data)
                })

                // test get endpoint
                // await fetch('/api/sanity/getEvents', {
                //   method: 'POST',
                //   headers: {
                //     'Content-Type': 'application/json',
                //   },
                //   body: JSON.stringify({
                //     query: `*[_type == "event"]`,
                //   }),
                // })
                //   .then(async (res) => {
                //     const data = await res.json()
                //     console.log(data)
                //   })
                //   .then((data) => {
                //     console.log(JSON.stringify(data))
                //   })
              }}
              h={'50px'}
              w={'100%'}
            >
              Get Events
            </Button> */}
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
              <Center
                style={
                  {
                    cursor: 'pointer',
                  } && openedVideo === true
                    ? {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: '1px solid white',
                        borderRadius: '15px',
                        margin: '3px',
                      }
                    : {
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                        borderRadius: '15px',
                        margin: '3px',
                      }
                }
              >
                <svg
                  onClick={() => {
                    toggleVideo()
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="250"
                  height="250"
                  viewBox="0 0 50 50"
                  fill="white"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 17.958984 13.037109 A 1.0001 1.0001 0 0 0 16.958984 14.041016 L 16.958984 14.064453 A 1.0001 1.0001 0 0 0 16.958984 14.070312 L 17.042969 36.037109 A 1.0001 1.0001 0 0 0 18.546875 36.898438 L 37.503906 25.828125 A 1.0001 1.0001 0 0 0 37.498047 24.095703 L 18.457031 13.169922 L 18.457031 13.171875 A 1.0001 1.0001 0 0 0 17.958984 13.037109 z M 18.964844 15.769531 L 35.001953 24.972656 L 19.037109 34.294922 L 18.964844 15.769531 z"></path>
                </svg>
              </Center>
              <Collapse in={openedVideo}>
                <Space h={'10px'} />
                <Overlay
                  zIndex={1000}
                  opacity={0}
                  color={'transparent'}
                  onClick={() => {
                    toggleVideo()
                  }}
                />
                <div
                  style={{
                    width: '100vw',
                    height: '100vh',
                  }}
                >
                  <Video />
                </div>
              </Collapse>
              <Center
                style={
                  {
                    cursor: 'pointer',
                  } && opened === true
                    ? {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: '1px solid white',
                        borderRadius: '15px',
                        margin: '3px',
                      }
                    : {
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                        borderRadius: '15px',
                        margin: '3px',
                      }
                }
              >
                <svg
                  onClick={() => {
                    toggle()
                  }}
                  x="0px"
                  y="0px"
                  width="250"
                  height="250"
                  viewBox="0 0 50 50"
                  fill="white"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <path d="M 25 2 C 17.832031 2 12 7.832031 12 15 C 12 20.078125 15.105469 26.347656 18.140625 31.492188 C 21.171875 36.636719 24.203125 40.609375 24.203125 40.609375 L 25 41.644531 L 25.796875 40.609375 C 25.796875 40.609375 28.828125 36.636719 31.859375 31.492188 C 34.894531 26.347656 38 20.078125 38 15 C 38 7.832031 32.167969 2 25 2 Z M 25 4 C 31.085938 4 36 8.914063 36 15 C 36 19.214844 33.105469 25.445313 30.140625 30.476563 C 27.570313 34.832031 25.644531 37.339844 25 38.199219 C 24.355469 37.339844 22.429688 34.832031 19.859375 30.476563 C 16.894531 25.445313 14 19.214844 14 15 C 14 8.914063 18.914063 4 25 4 Z M 25 10 C 22.25 10 20 12.25 20 15 C 20 17.75 22.25 20 25 20 C 27.75 20 30 17.75 30 15 C 30 12.25 27.75 10 25 10 Z M 25 12 C 26.667969 12 28 13.332031 28 15 C 28 16.667969 26.667969 18 25 18 C 23.332031 18 22 16.667969 22 15 C 22 13.332031 23.332031 12 25 12 Z M 7.296875 32 L 1.578125 48 L 48.421875 48 L 42.703125 32 L 35.050781 32 C 34.660156 32.6875 34.269531 33.355469 33.878906 34 L 41.296875 34 L 45.578125 46 L 4.421875 46 L 8.703125 34 L 16.121094 34 C 15.730469 33.355469 15.339844 32.6875 14.949219 32 Z"></path>
                </svg>
              </Center>

              <Collapse in={opened}>
                <Space h={'10px'} />
                <Locations />
              </Collapse>
            </Flex>
            <Space h={'10px'} />
            {/* <Center>
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  minWidth: '85vw',
                  backgroundColor: 'rgba(000,000,000,.2)',
                }}
              />
            </Center>
            <Space h={'10px'} />
            <Container p={'lg'}>
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                wrap={'wrap'}
              >
                <Title
                  order={1}
                  style={{
                    fontSize: '2rem',
                    textShadow: '1px 1px 3px rgba(000,000,000,.2)',
                    WebkitTextFillColor: 'rgba(000,000,000,1)',
                  }}
                >
                  Event Calendar
                </Title>
                <CalendarComponent />
              </Flex>
            </Container> */}
          </Card>
        </Container>

        {/* <Container p={'lg'}>
          <Card shadow={'md'} radius={'md'} bg={'dark'} style={{ width: '100%' }}>
            <Title
              order={1}
              style={{
                textShadow: '1px 1px 3px #000',
                WebkitTextFillColor: 'rgba(255,255,255,1)',
                fontSize: '2rem',
              }}
            >
              How are the improvements looking?
            </Title>
            <Center>
              <Rating
                size={'xl'}
                color={'yellow'}
                defaultValue={5}
                emptySymbol={<span>👎</span>}
                fullSymbol={<span>👍</span>}
                value={5}
                onChange={(value) => {
                  fetch('/api/vote', {
                    method: 'POST',
                    body: JSON.stringify({
                      value,
                    }),
                  })
                }}
              />
            </Center>
          </Card>
        </Container> */}
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
