'use client'

import { useState, useEffect } from 'react'
import imgCompete from '@public/static/images/tgf_home_page_compete.jpg'
import imgGolf from '@public/static/images/tgf_home_page_golf.jpg'
import { Carousel, Embla } from '@mantine/carousel'
import { BackgroundImage, Space } from '@mantine/core'
import carouselStyles from '@styles/CarouselTransition.module.scss'
import styles from './Carousel.module.scss'

const letters = [
  { letter: 'T', definition: 'he' },
  { letter: 'G', definition: 'olf' },
  { letter: 'F', definition: 'ellowship' },
]

export default function CarouselComponent() {
  const [activeLetter, setActiveLetter] = useState<string>(letters[0].letter)
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
    let i = 0
    const interval = setInterval(() => {
      setActiveLetter(letters[i].letter)
      i++
      if (i >= letters.length) {
        clearInterval(interval)
      }
    }, 2000) // adjust the time interval as needed
    return () => clearInterval(interval)
  }, [])
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

  if (!embla) return null
  if (loading) return null

  return (
    <>
      <div className={styles.letterContainer}>
        {letters.map(
          (item, index) =>
            item.letter === activeLetter && (
              <div
                className={`${styles.letter} ${
                  item.letter === activeLetter ? styles.active : ''
                }`}
                key={index}
                style={{
                  color: 'white',
                }}
              >
                <div className={styles.definition}>{item.definition}</div>
              </div>
            )
        )}
      </div>
      <Carousel
        align={'start'}
        draggable={false}
        slideGap={0}
        withIndicators={false}
        withControls={false}
        getEmblaApi={setEmbla}
        onSlideChange={handleScrollSetter}
        id="carousel"
        w={'100vw'}
        style={{
          transition: 'all 1s ease-in-out',
          width: '100%',
          height: '100%',
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
            <Space mih={'800px'} mah={'1000px'} />
          </BackgroundImage>
        </Carousel.Slide>
        <Carousel.Slide>
          <BackgroundImage src={imgGolf.src}>
            <Space mih={'800px'} mah={'1000px'} />
          </BackgroundImage>
        </Carousel.Slide>
      </Carousel>
    </>
  )
}
