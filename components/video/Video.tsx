'use client'

import { VideoProps } from '../../types/props'
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
    return <div>Loading...</div>
  }
  return (
    <div className={styles.videoWrapper}>
      <video className={styles.video} muted={true} controls={true}>
        <source src={videoSource} />
      </video>
    </div>
  )
}
export default Video
