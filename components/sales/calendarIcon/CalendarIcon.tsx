import styles from './CalendarIcon.module.scss'

export interface CalendarIconProps {
  date: Date
}

const CalendarIcon = (props: CalendarIconProps) => {
  const { date } = props

  const thisDate = new Date(date)

  const calendarIconMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' })
  }

  const calendarIconDay = (date: Date) => {
    return Number(date.toISOString().slice(8, 10))
  }

  const calendarIconWeekday = (date: Date) => {
    return date.toLocaleString('en-us', { weekday: 'long' })
  }

  if (!date) {
    return null
  } else {
    return (
      <div className={styles.wrap}>
        <div className={styles.month}>{calendarIconMonth(thisDate)}</div>
        <div className={styles.day}>{calendarIconDay(thisDate)}</div>
        <div className={styles.weekday}>{calendarIconWeekday(thisDate)}</div>
      </div>
    )
  }
}
export default CalendarIcon
