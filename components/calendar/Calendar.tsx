'use client'
import { useState, useEffect } from 'react'
import styles from './Calendar.module.css'
import getAllLeagueDates from './allLeagueDates'
import getAllEventDates from './allEventDates'
import { Calendar } from '@mantine/dates'
import { Indicator, Text } from '@mantine/core'
const today = new Date()

type CalendarProps = {
  date: string
  name: string
}

type EventNameColors = {
  [key: string]: string
}

type EventRound = {
  date: string
  name: string
  divisions: string[]
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const CalendarComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [footerItems, setFooterItems] = useState([] as EventRound[])
  const [calendarProps, setCalendarProps] = useState([] as CalendarProps[])
  const [eventNameColors, setEventNameColors] = useState({} as EventNameColors)
  const [roundEvents, setRoundEvents] = useState([] as EventRound[])
  const [loading, setLoading] = useState(true)
  // console.log('selectedMonth', selectedMonth)
  // console.log('selectedYear', selectedYear)
  // console.log('selectedDate', selectedDate)
  // console.log('footerItems', footerItems)
  // console.log('calendarProps', calendarProps)
  // console.log('eventNameColors', eventNameColors)
  // console.log('roundEvents', roundEvents)
  // console.log('loading', loading)

  //set roundEvents Data
  useEffect(() => {
    setLoading(true)
    const allEventDates = async () => {
      await getAllEventDates(selectedMonth, selectedYear).then((res) => {
        setRoundEvents(res)
      })
    }
    allEventDates()
    setLoading(false)
  }, [selectedMonth])

  //set footerItems
  useEffect(() => {
    setLoading(true)
    const footerItems: EventRound[] = []
    roundEvents.forEach((event) => {
      const calendarDay = event.date.split('/')[1]
      if (calendarDay === selectedDate.toString()) {
        footerItems.push(event)
      }
    })
    setFooterItems(footerItems)
    setLoading(false)
  }, [selectedDate])

  //set calendarProps and eventNameColors
  useEffect(() => {
    setLoading(true)
    const calendarProps: CalendarProps[] = []
    const eventNameColors: EventNameColors = {}
    roundEvents.forEach((event) => {
      const calendarDay = event.date.split('/')[1]
      eventNameColors[calendarDay] =
        '#' + Math.floor(Math.random() * 16777215).toString(16)
      calendarProps.push({
        date: calendarDay,
        name: event.name,
      })
    })
    setEventNameColors(eventNameColors)
    setCalendarProps(calendarProps)
    setLoading(false)
  }, [roundEvents])
  const FooterItemsComponent = () => {
    if (footerItems.length === 0) return <></>
    return (
      <>
        <Text>Events on this day:</Text>
        <Text>
          {months[selectedMonth]} {selectedDate}, {selectedYear}
        </Text>
        {footerItems.map((item) => {
          return (
            <div
              key={item.date}
              style={{
                backgroundColor: eventNameColors[item.date.split('/')[1]] ?? 'black',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '5px',
                padding: '5px',
              }}
            >
              <Text>{item.name}</Text>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Calendar
        className={styles.calendar}
        size="md"
        locale="en"
        defaultDate={new Date(selectedYear, selectedMonth, selectedDate)}
        defaultLevel={'month'}
        firstDayOfWeek={1}
        onMonthSelect={(month: Date) => {
          setSelectedMonth(month.getMonth())
        }}
        onYearSelect={(year: Date) => {
          setSelectedYear(year.getFullYear())
        }}
        getDayProps={(date) => ({
          onClick: () => {
            setSelectedDate(date.getDate())
          },
        })}
        renderDay={(day) => {
          const EventName = calendarProps.find(
            (event) => event.date === day.getDate().toString()
          )?.name
          if (EventName) {
            return (
              <Indicator
                size={5}
                color={eventNameColors[day.getDate()] ?? 'black'}
                offset={-2}
              >
                {day.getDate()}
              </Indicator>
            )
          }
        }}
      />
      {footerItems.length > 0 && <FooterItemsComponent />}
    </div>
  )
}
