'use client'

import { useEffect, useState } from 'react'

const Video = () => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const source = 'https://www.youtube.com/embed/-wYJnzg6NHo'

  useEffect(() => {
    setVideoLoaded(true)
  }, [])

  if (!videoLoaded) {
    return <div></div>
  }
  return (
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
  )
}
export default Video
