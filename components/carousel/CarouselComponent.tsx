'use client'

import { useState, useEffect } from 'react'
import imgCompete from '@public/static/images/tgf_default_pic_7.webp'
import imgGolf from '@public/static/images/tgf_default_pic_6.webp'
import { Carousel, Embla } from '@mantine/carousel'

import {
  BackgroundImage,
  Center,
  Container,
  Space,
  Text,
  Flex,
  Input,
  Button,
  Transition,
} from '@mantine/core'
import carouselStyles from '@styles/CarouselTransition.module.scss'
import Link from 'next/link'

export default function CarouselComponent() {
  const [embla, setEmbla] = useState<Embla | null>(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const SCROLL_COUNT = 2

  const handleNextScroll = () => {
    const carousel = document.getElementById('carousel')

    if (embla) {
      const nextIndex = (scrollIndex + 1) % SCROLL_COUNT

      if (carousel) {
        carousel.classList.add(carouselStyles.transitionOut)

        setTimeout(() => {
          embla.scrollTo(nextIndex, false)
          carousel.classList.remove(carouselStyles.transitionOut)
          carousel.classList.add(carouselStyles.transitionIn)
        }, 1000)
      }
    }
  }

  const handleScrollSetter = (index: number) => {
    setScrollIndex(index)
  }

  useEffect(() => {
    if (loading) {
      handleNextScroll()
      setLoading(false)
    } else {
      const timer = setTimeout(() => {
        handleNextScroll()
      }, 10000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [embla, scrollIndex])

  const animationText = {
    in: { opacity: 1, transform: 'skewX(0deg)' },
    out: { opacity: 0, transform: 'skewX(-40deg)' },
    common: { transformOrigin: 'top', transform: 'skewX(-20deg)', opacity: 0 },
    transitionProperty: 'transform, opacity',
    timingFunction: 'ease-in',
  }

  const StyleGenerator = (index: number, text: string, name: string) => {
    return (
      <Transition
        mounted={
          name === 'styledTextThree' || name === 'styledTextFour'
            ? scrollIndex === 1
            : scrollIndex === 0
        }
        keepMounted={true}
        transition={animationText}
        timingFunction={'ease'}
        duration={Math.floor((300 * (index + 13)) / 4)}
        key={index + name}
      >
        {(styles) => (
          <Text
            style={{
              ...styles,
              textShadow: '5px 5px 5px #000',
              WebkitTextFillColor: 'rgba(255,255,255,1)',
              mixBlendMode: 'plus-lighter',
              backgroundBlendMode: 'overlay',
            }}
            fz={
              name === 'styledTextTwo' || name === 'styledTextFour'
                ? '1.5rem'
                : '2rem'
            }
            m={'0.2rem'}
            fw={'bolder'}
            c={'white'}
            opacity={1}
          >
            {text === ' ' ? <br style={{ width: '20px' }} /> : text}
          </Text>
        )}
      </Transition>
    )
  }

  const styledText = 'Weeknight 9s & Weekend 18s.'.split('').map((letter, index) => {
    return StyleGenerator(index, letter, 'styledText')
  })

  const styledTextTwo = 'Compete with your friends.'
    .split('')
    .map((letter, index) => {
      return StyleGenerator(index, letter, 'styledTextTwo')
    })

  const styledTextThree = 'Join the golf community.'
    .split('')
    .map((letter, index) => {
      return StyleGenerator(index, letter, 'styledTextThree')
    })

  const styledTextFour = 'Get the best tips and tricks.'
    .split('')
    .map((letter, index) => {
      return StyleGenerator(index, letter, 'styledTextFour')
    })

  if (loading) {
    return <Center>Loading...</Center>
  }

  return (
    <Carousel
      align={'start'}
      draggable={false}
      slideGap={0}
      withIndicators={false}
      withControls={false}
      getEmblaApi={setEmbla}
      onSlideChange={handleScrollSetter}
      id="carousel"
      style={{
        transition: 'all 1s ease-in-out',
        overflow: 'hidden',
        width: '100%',
        minHeight: '500px',
      }}
    >
      <Carousel.Slide>
        <BackgroundImage
          src={imgCompete.src}
          style={{
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // this gives the overlay
          }}
        >
          <Container p={0} m={0} mih={'600px'} miw={'100%'}>
            <Space h={'10rem'} />
            <Flex direction={'column'} align={'flex-start'} justify={'flex-start'}>
              <Container p={'100px'} m={0}>
                <Flex
                  direction={'row'}
                  align={'center'}
                  justify={'flex-start'}
                  wrap={'wrap'}
                  p={0}
                  m={0}
                  maw={'90vw'}
                >
                  {styledText.map((text) => {
                    return { ...text }
                  })}
                </Flex>
                <Flex
                  direction={'row'}
                  align={'center'}
                  justify={'flex-start'}
                  wrap={'wrap'}
                  p={0}
                  m={0}
                  maw={'90vw'}
                >
                  {styledTextTwo.map((text) => {
                    return { ...text }
                  })}
                </Flex>
                <Link href="/shop">
                  <Button
                    size={'xl'}
                    type={'button'}
                    variant={'gradient'}
                    radius={'lg'}
                    color="white"
                    gradient={{
                      from: 'rgba(0,0,0,0.2)',
                      deg: 45,
                      to: 'dark',
                    }}
                  >
                    BECOME A MEMBER
                  </Button>
                </Link>
              </Container>
            </Flex>
          </Container>
        </BackgroundImage>
      </Carousel.Slide>
      <Carousel.Slide>
        <BackgroundImage
          src={imgGolf.src}
          style={{
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // this gives the overlay
          }}
        >
          <Container p={0} m={0} mih={'600px'} miw={'100%'}>
            <Space h={'10rem'} />
            <Flex direction={'column'} align={'flex-start'} justify={'flex-start'}>
              <Container p={'100px'} m={0}>
                <Flex
                  direction={'row'}
                  align={'center'}
                  justify={'flex-start'}
                  wrap={'wrap'}
                  p={0}
                  m={0}
                  maw={'90vw'}
                >
                  {styledTextThree.map((text) => {
                    return { ...text }
                  })}
                </Flex>
                <Flex
                  direction={'row'}
                  align={'center'}
                  justify={'flex-start'}
                  wrap={'wrap'}
                  p={0}
                  m={0}
                  maw={'90vw'}
                >
                  {styledTextFour.map((text) => {
                    return { ...text }
                  })}
                </Flex>
                <Link href="/community">
                  <Button
                    size={'xl'}
                    type={'button'}
                    variant={'gradient'}
                    radius={'lg'}
                    color="white"
                    gradient={{
                      from: 'rgba(0,0,0,0.2)',
                      deg: 45,
                      to: 'dark',
                    }}
                  >
                    JOIN THE COMMUNITY
                  </Button>
                </Link>
              </Container>
            </Flex>
          </Container>
        </BackgroundImage>
      </Carousel.Slide>
    </Carousel>
  )
}
