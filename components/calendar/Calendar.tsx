'use client'
import { useState, useEffect } from 'react'
import styles from './Calendar.module.css'
import getAllLeagueDates from './allLeagueDates'

const today = new Date()

type Event = {
  dates: [
    {
      date: string
    }
  ]
  name: string
}
//example:
// const leagueEvent = [
//   {
//     dates: [
//       {
//         date: '12/20/2021',
//       },
//       {
//         date: '12/21/2021',
//       },
//     ],
//     name: 'Event 1',
//   },
// ]

type CalendarProps = {
  date: string
  name: string
}

type EventNameColors = {
  [key: string]: string
}

export const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDay())
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [footerItems, setFooterItems] = useState([] as Event[])
  const [leagueEvent, setLeagueEvent] = useState([] as Event[])
  const [calendarProps, setCalendarProps] = useState([] as CalendarProps[])
  const [eventNameColors, setEventNameColors] = useState({} as EventNameColors)

  useEffect(() => {
    const allLeagueDates = async () => {
      await getAllLeagueDates(selectedMonth, selectedYear).then((res) => {
        setLeagueEvent(res)
      })
    }
    allLeagueDates()
  }, [])

  useEffect(() => {
    const footerItems: Event[] = []
    leagueEvent.forEach((event) => {
      event.dates.forEach((date) => {
        const dateArray = date.date.split('/')
        const month = parseInt(dateArray[0])
        const day = parseInt(dateArray[1])
        const year = parseInt(dateArray[2])
        if (
          month === selectedMonth + 1 &&
          day === selectedDate &&
          year === selectedYear
        ) {
          footerItems.push(event)
        }
      })
    })
    setFooterItems(footerItems)
  }, [selectedDate])

  useEffect(() => {
    const calendarProps: CalendarProps[] = []
    const eventNameColors: EventNameColors = {}
    leagueEvent.forEach((event) => {
      eventNameColors[event.name] =
        '#' + Math.floor(Math.random() * 16777215).toString(16)
      event.dates.forEach((date) => {
        const dateArray = date.date.split('/')
        const day = parseInt(dateArray[1])
        calendarProps.push({
          date: day.toString(),
          name: event.name,
        })
      })
    })
    setEventNameColors(eventNameColors)
    setCalendarProps(calendarProps)
  }, [leagueEvent])

  const calendar: string[] = []
  calendar.length = 41
  calendar.fill('')

  const firstDayOfMonthString = new Date(selectedYear, selectedMonth, 1)
    .toString()
    .substring(0, 3)

  const firstDayOfMonth =
    firstDayOfMonthString === 'Mon'
      ? 1
      : firstDayOfMonthString === 'Tue'
      ? 2
      : firstDayOfMonthString === 'Wed'
      ? 3
      : firstDayOfMonthString === 'Thu'
      ? 4
      : firstDayOfMonthString === 'Fri'
      ? 5
      : firstDayOfMonthString === 'Sat'
      ? 6
      : 0

  calendar[firstDayOfMonth] = '1'

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

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()

  for (let i = 1; i < daysInMonth; i++) {
    calendar[firstDayOfMonth + i] = (i + 1).toString()
  }

  const handleSelectedDateClick = (date: string) => {
    setSelectedDate(parseInt(date))
  }

  return (
    <div>
      <div className={styles.calendarWrapper}>
        <div className={styles.filterWrapper}>
          <div className={styles.filterItem}>
            <label className={styles.filterItemLabel}>Filter 1</label>
            <input type="checkbox" className={styles.filterItemInput} />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterItemLabel}>Filter 2</label>
            <input type="checkbox" className={styles.filterItemInput} />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterItemLabel}>Filter 3</label>
            <input type="checkbox" className={styles.filterItemInput} />
          </div>
        </div>
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarHeaderItem}>
              <h1 className={styles.calendarMonthText}>{months[selectedMonth]}</h1>
            </div>
          </div>
          <div className={styles.calendarGridWrapper}>
            <div className={styles.calendarGrid}>
              <div className={styles.calendarGridHeaderWrapper}>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Sun</h2>
                </div>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Mon</h2>
                </div>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Tue</h2>
                </div>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Wed</h2>
                </div>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Thu</h2>
                </div>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Fri</h2>
                </div>
                <div className={styles.calendarGridHeaderItem}>
                  <h2 className={styles.calendarGridHeaderItemText}>Sat</h2>
                </div>
              </div>
              <div className={styles.calendarGridItems}>
                {calendar.map((day, index) => (
                  <div
                    className={styles.calendarGridItem}
                    key={index}
                    onClick={() => handleSelectedDateClick(day)}
                  >
                    <div
                      className={
                        day === selectedDate.toString()
                          ? styles.calendarGridItemDaySelected
                          : styles.calendarGridItemDay
                      }
                      key={index}
                    >
                      {day !== '' && (
                        <>
                          <div className={styles.calendarGridItemDayCircle}>
                            <svg
                              viewBox="0 0 100 100"
                              xmlns="http://www.w3.org/2000/svg%22%3E"
                              className={styles.calendarGridItemDayCircleSvg}
                            >
                              <circle
                                cx="100"
                                cy="100"
                                r="75"
                                fill="
                            rgba(255, 255, 255, 0.7)
                            "
                                stroke="black"
                                strokeWidth="3"
                              ></circle>
                              <text
                                fill="black"
                                x="50"
                                y="-50"
                                fontSize="46px"
                                className={styles.calendarGridItemDayText}
                              >
                                {day.length === 1 ? `0${day}` : day}
                              </text>
                            </svg>
                          </div>

                          <div className={styles.calendarGridItemEvents}>
                            {calendarProps.map(
                              (event, indexDayEvent) =>
                                day === event.date && (
                                  <div
                                    className={styles.calendarGridItemEvent}
                                    key={indexDayEvent}
                                    style={{
                                      backgroundColor: eventNameColors[event.name],
                                    }}
                                  >
                                    <h1
                                      className={styles.calendarGridItemEventText}
                                      hidden={true}
                                    >
                                      {event.name}
                                    </h1>
                                  </div>
                                )
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.calendarGridFooter}>
                <div className={styles.calendarGridFooterItems}>
                  {footerItems.map((item, index) => (
                    <div
                      className={styles.calendarGridFooterItem}
                      key={index}
                      style={{
                        backgroundColor: eventNameColors[item.name],
                        opacity: 0.9,
                      }}
                    >
                      <h2 className={styles.calendarGridFooterItemText}>
                        {item.name}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
