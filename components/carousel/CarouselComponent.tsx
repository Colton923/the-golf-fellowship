'use client'

import { useState, useEffect } from 'react'
import imgCompete from '@public/static/images/tgf_default_pic_7.jpg'
import imgGolf from '@public/static/images/tgf_default_pic_6.jpg'
import { Carousel, Embla } from '@mantine/carousel'
import styles from './Carousel.module.scss'
import {
  BackgroundImage,
  Center,
  Container,
  Space,
  Text,
  Flex,
  Button,
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
          <Container p={0} m={0} miw={'100%'} h={'800px'}>
            <Flex h={'100%'} w={'100%'} direction={'column'} p={'xs'}>
              <Space h={'30%'} />
              <Text className={styles.slideTextTitle}>Race for the Cup!</Text>
              <Text className={styles.slideTextSubTitle}>
                Earn points and compete to win the TGF Championship.
              </Text>
              <Space h={'10%'} />
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
          <Container p={0} m={0} miw={'100%'} h={'800px'}>
            <Flex h={'100%'} w={'100%'} direction={'column'} p={'xs'}>
              <Space h={'30%'} />
              <Text className={styles.slideTextTitle}>Play, Compete & Connect</Text>
              <Text className={styles.slideTextSubTitle}>
                Weeknight 9s and Weekend 18s. Qualify and represent your TGF League.
              </Text>
              <Space h={'10%'} />
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
            </Flex>
          </Container>
        </BackgroundImage>
      </Carousel.Slide>
    </Carousel>
  )
}
