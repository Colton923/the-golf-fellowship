import { Box, Text, Space, BackgroundImage } from '@mantine/core'

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
type DataForCard = { image: string; title: string; text: string }

type CardsProps = {
  cardData: DataForCard[]
}

const Cards = (cardData: CardsProps) => {
  return <>{cardData.cardData.map((card) => renderCard(card))}</>
}

export default Cards
