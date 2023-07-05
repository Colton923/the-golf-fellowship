'use client'

import Video from '@components/video/Video'
import Image from 'next/image'
import imgCompete from '@public/static/images/tgf_home_page_compete.jpg'
import imgGolf from '@public/static/images/tgf_home_page_golf.jpg'
import imgImprove from '@public/static/images/tgf_home_page_improve.jpg'
import imgNetwork from '@public/static/images/tgf_home_page_network.jpg'
import {
  Flex,
  Text,
  Title,
  Container,
  BackgroundImage,
  Box,
  Space,
} from '@mantine/core'
import CarouselComponent from '@components/carousel/CarouselComponent'
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
      align={'flex-start'}
      justify={'flex-start'}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 1)', // this gives the overlay
        width: '100vw',
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
      <Flex direction="column" align="center" justify="center">
        <Title>WHAT WE DO</Title>
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
    </Flex>
  )
}
