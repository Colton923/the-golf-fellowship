'use client'

import { VideoProps } from '../../types/props/VideoProps'
import styles from './Video.module.css'

import { useState, useEffect } from 'react'

const Video = (videoProps: VideoProps) => {
  const { source } = { ...videoProps }
  const [videoSource, setVideoSource] = useState('')
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    setVideoSource(source)
    setVideoLoaded(true)
  }, [source])

  if (!videoLoaded) {
    return <div></div>
  }
  return (
    <iframe
      className={styles.video}
      src={videoSource + '?autoplay=1&mute=1&controls=0&loop=1&vq=hd1080'}
      title="TGF Membership"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; controls=0; mute=1"
    ></iframe>
  )
}
export default Video
