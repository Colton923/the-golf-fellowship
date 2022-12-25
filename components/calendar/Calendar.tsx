'use client'
import { useState, useEffect } from 'react'
import styles from './Calendar.module.css'
import getAllLeagueDates from './allLeagueDates'
import getAllEventDates from './allEventDates'

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
export const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDay())
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [footerItems, setFooterItems] = useState([] as EventRound[])
  const [calendarProps, setCalendarProps] = useState([] as CalendarProps[])
  const [eventNameColors, setEventNameColors] = useState({} as EventNameColors)
  const [roundEvents, setRoundEvents] = useState([] as EventRound[])
  const [calendar, setCalendar] = useState([] as string[])
  const [loading, setLoading] = useState(true)

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

  //set calendar
  useEffect(() => {
    setLoading(true)
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
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    for (let i = 1; i < daysInMonth; i++) {
      calendar[firstDayOfMonth + i] = (i + 1).toString()
    }
    setCalendar(calendar)
    setLoading(false)
  }, [selectedMonth])

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
      eventNameColors[event.name] =
        '#' + Math.floor(Math.random() * 16777215).toString(16)
      const calendarDay = event.date.split('/')[1]
      calendarProps.push({
        date: calendarDay,
        name: event.name,
      })
    })
    setEventNameColors(eventNameColors)
    setCalendarProps(calendarProps)
    setLoading(false)
  }, [roundEvents])

  //Change selected date on calendar click
  const handleSelectedDateClick = (date: string) => {
    setSelectedDate(parseInt(date))
  }

  //Change selected month on arrow click
  const handleSelectedMonthClick = (direction: string) => {
    setLoading(true)
    if (direction === 'left') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
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
                <button
                  className={styles.calendarHeaderItemButton}
                  onClick={() => handleSelectedMonthClick('left')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                    />
                  </svg>
                </button>
                <h1 className={styles.calendarMonthText}>
                  {!loading ? months[selectedMonth] + ' ' + selectedYear : null}
                </h1>
                <button
                  className={styles.calendarHeaderItemButton}
                  onClick={() => handleSelectedMonthClick('right')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M8.59,7.41L13.17,12L8.59,16.59L10,18L16,12L10,6L8.59,7.41Z"
                    />
                  </svg>
                </button>
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
      )}
    </div>
  )
}
