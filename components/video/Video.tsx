'use client'

import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Collapse, Center, Space, Overlay } from '@mantine/core'

const Video = () => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [openedVideo, { toggle: toggleVideo }] = useDisclosure(false)
  const source = 'https://www.youtube.com/embed/-wYJnzg6NHo'

  useEffect(() => {
    setVideoLoaded(true)
  }, [])

  if (!videoLoaded) {
    return <div></div>
  }
  return (
    <>
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
          width="50"
          height="50"
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
          }}
        >
          <iframe
            src={source + '?autoplay=1&mute=1&controls=0&loop=1&vq=hd1080'}
            title="TGF Membership"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; controls=0; mute=1"
          ></iframe>
        </div>
      </Collapse>
    </>
  )
}
export default Video
