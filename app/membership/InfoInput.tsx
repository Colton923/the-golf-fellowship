import styles from './Membership.module.scss'
import { IconInfoCircle } from '@tabler/icons-react'

type Props = {
  handler: () => void
}

const InfoInput = (props: Props) => {
  const { handler } = props
  return (
    <div className={styles.info}>
      <IconInfoCircle
        size={30}
        onClick={() => {
          handler()
        }}
      />
    </div>
  )
}

export default InfoInput
