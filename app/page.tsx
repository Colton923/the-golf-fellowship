'use client'

import Video from '@components/video/Video'
import imgCompete from '@public/static/images/tgf_default_pic_1.jpg'
import imgGolf from '@public/static/images/tgf_default_pic_2.jpg'
import imgImprove from '@public/static/images/tgf_default_pic_3.jpg'
import imgNetwork from '@public/static/images/tgf_default_pic_4.jpg'
import {
  Flex,
  Text,
  Container,
  BackgroundImage,
  Box,
  Space,
  Center,
  Title,
  Rating,
  Card,
  Button,
} from '@mantine/core'
import Link from 'next/link'
import CarouselComponent from '@components/carousel/CarouselComponent'
import { CalendarComponent } from '@components/calendar/Calendar'
import Locations from '@components/locations/Locations'

const testData1 = {
  title: '2023 DFW CHAMPIONSHIP',
  date: '2023-08-05T13:00:00.000Z',
  location: {
    title: 'Waterchase Golf Club',
  },
  cost: [
    {
      title: 'default_fee_championship',
      plus: 70,
      basic: 80,
      guest: 90,
    },
  ],
  sideGames: [
    {
      title: 'default_games',
      games: [
        'Individual Net & Gross',
        'TEAM (Foursome) Net',
        'Closest to Pins',
        'Hole-in-One Eligibility',
        'MVP Eligibility',
      ],
      fee: 25,
    },
  ],
  pointsRaces: [
    {
      title: 'default_net',
      par: 2,
      birdie: 3,
      eagle: 4,
      dblEagle: 5,
      holeInOne: 9,
    },
    {
      title: 'default_gross',
      par: 2,
      birdie: 3,
      eagle: 5,
      dblEagle: 9,
      holeInOne: 9,
    },
  ],
  memberStatus: ['Plus', 'Basic', 'Guest'],
  sideGamesOptions: ['Playing Partner Request', 'Dinner after Golf'],
  tees: ['Blues', 'Whites'],
  quantity: 1,
}

const cardData = [
  {
    image: imgGolf.src,
    title: 'GOLF',
    text: 'REFUEL & ENJOY a Regular Schedule of Weeknight 9s & Weekend 18s on a Variety of Courses in Your Area & Across Texas',
  },
  {
    image: imgNetwork.src,
    title: 'NETWORK',
    text: 'CONNECT & BUILD New Friendships, Personally & Professionally and Find Camaraderie thru Shared Experiences',
  },
  {
    image: imgCompete.src,
    title: 'COMPETE',
    text: 'EXPERIENCE the THRILL of Competition thru Gross, Net, Two Man, Team, Stableford, Match Play, Ryder Cup & More Formats',
  },
  {
    image: imgImprove.src,
    title: 'IMPROVE',
    text: 'DEVELOP & LEVEL UP Your Golf Skills thru Assessment, Evaluation & Tracking Focused on Quality Practice & Lower Scores',
  },
]

// Helper Function
const renderCard = (card: { image: string; title: string; text: string }) => (
  <Box
    mx={'xs'}
    miw={'300px'}
    mih={'300px'}
    maw={'600px'}
    mah={'600px'}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0',
      textAlign: 'center',
    }}
    key={card.title}
  >
    <BackgroundImage
      src={card.image}
      radius={'sm'}
      style={{
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0, 0, 0, 0.23)',
      }}
    >
      <Space h={'100px'} />
      <Text
        h={'100px'}
        style={{
          textShadow: '1px 1px 3px #000',
          WebkitTextFillColor: 'rgba(255,255,255,1)',
          fontSize: '3rem',
          fontWeight: 'bolder',
        }}
      >
        {card.title}
      </Text>
      <Text fz={'md'} fw={'normal'} c={'white'}>
        {card.text}
      </Text>
      <Space h={'10px'} />
    </BackgroundImage>
  </Box>
)

export default function Index() {
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
          maxWidth: '1500px',
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
        <Container p={'lg'} w={'100%'} maw={'100%'}>
          <Card
            shadow={'md'}
            radius={'md'}
            bg={'white'}
            style={{ width: '100%', maxWidth: '100%' }}
          >
            <Space h={'10px'} />
            <Center>
              <Flex direction={'column'} align={'center'} justify={'center'}>
                <Title
                  order={1}
                  style={{
                    fontSize: '2rem',
                    textShadow: '1px 1px 3px rgba(000,000,000,.2)',
                    WebkitTextFillColor: 'rgba(000,000,000,1)',
                  }}
                >
                  We Golf Here
                </Title>
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    minWidth: '85vw',
                    backgroundColor: 'rgba(000,000,000,.2)',
                  }}
                />
                <Space h={'10px'} />
              </Flex>
            </Center>

            <Space h={'10px'} />
            <Button
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
            </Button>
            <Locations />
            <Space h={'10px'} />
            <Center>
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
            </Container>
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
          {cardData.map((card) => renderCard(card))}
        </Flex>
      </Flex>
      <div style={{ backgroundColor: 'black', height: '150px', width: '100%' }}>
        <Container p={'lg'}>
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            wrap={'wrap'}
          >
            <Flex
              direction={'row'}
              align={'center'}
              justify={'center'}
              wrap={'wrap'}
            >
              <Text
                fz={'md'}
                fw={'normal'}
                c={'white'}
                style={{ textAlign: 'center' }}
              >
                The Golf Fellowship
              </Text>
              <Space w={'10px'} />
              <Text
                fz={'md'}
                fw={'normal'}
                c={'white'}

                // style={{ textAlign: 'center' }}
              >
                |
              </Text>
              <Space w={'10px'} />
              <Text
                fz={'md'}
                fw={'normal'}
                c={'white'}
                style={{ textAlign: 'center' }}
              >
                123 Main St, San Antonio, TX, 12345
              </Text>
              <Space w={'10px'} />
            </Flex>
            <Flex
              direction={'row'}
              align={'center'}
              justify={'center'}
              wrap={'wrap'}
            >
              <Space w={'10px'} />
              <Text
                fz={'md'}
                fw={'normal'}
                c={'white'}
                style={{ textAlign: 'center' }}
              >
                Contact us: (123) 456-7890 |
              </Text>
              <Space w={'10px'} />
              <Link
                style={{ textDecoration: 'none' }}
                href="https://www.facebook.com/GolfFellowshipSA"
              >
                <Text
                  fz={'md'}
                  fw={'normal'}
                  c={'white'}
                  style={{ textAlign: 'center' }}

                  // style={{ textAlign: 'center' }}
                >
                  Facebook
                </Text>
              </Link>
              <Space w={'10px'} />
              <Text
                fz={'md'}
                fw={'normal'}
                c={'white'}
                style={{ textAlign: 'center' }}
              >
                |
              </Text>
              <Space w={'10px'} />
              <Link
                style={{ textDecoration: 'none' }}
                href="https://www.instagram.com/GolfFellowshipSA"
              >
                <Text
                  fz={'md'}
                  fw={'normal'}
                  c={'white'}
                  style={{ textAlign: 'center' }}
                >
                  Instagram
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </div>
    </Flex>
  )
}
