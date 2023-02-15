'use client'

import { VideoProps } from '../../types/props'
import styles from './Video.module.css'

const Video = (videoProps: VideoProps) => {
  const { source } = { ...videoProps }

  return (
    <div className={styles.videoWrapper}>
      <video className={styles.video} muted={true} controls={true}>
        <source src={source} type="video/mp4" />
      </video>
    </div>
  )
}
export default Video
