'use client'
import { useState, useEffect } from 'react'
import styles from './Calendar.module.css'
import getAllLeagueDates from './allLeagueDates'
import getAllEventDates from './allEventDates'
import { Calendar } from '@mantine/dates'
import { Badge, Indicator, Text, Flex } from '@mantine/core'
import Link from 'next/link'
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
        <Text>Click to view event</Text>
        <Text>
          {months[selectedMonth]} {selectedDate}, {selectedYear}
        </Text>
        <Flex direction={'column'} align={'center'}>
          {footerItems.map((item) => {
            return (
              <Link
                key={item.date}
                href={`https://thegolffellowship.com/shop/ols/search?keywords=${item.name
                  .replace(' ', '')
                  .replace(' ', '')
                  .toLowerCase()}`}
              >
                <Badge color={'dark'} h={'auto'} radius={'sm'} m={'sm'}>
                  <Text>{item.name}</Text>
                </Badge>
              </Link>
            )
          })}
        </Flex>
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
        wordWrap: 'break-word',
        padding: '10px',
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
              <Badge
                variant="gradient"
                gradient={{
                  from: eventNameColors[day.getDate()] ?? 'black',
                  to: 'gray',
                }}
              >
                {day.getDate()}
              </Badge>
            )
          }
        }}
      />
      {footerItems.length > 0 && <FooterItemsComponent />}
    </div>
  )
}
