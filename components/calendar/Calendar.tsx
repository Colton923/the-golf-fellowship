'use client'
import { useState } from 'react'
import styles from './Calendar.module.css'

const today = new Date()

export const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDay())
  const [selectedDate, setSelectedDate] = useState(today.getDate())

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

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()

  for (let i = 1; i < daysInMonth; i++) {
    calendar[firstDayOfMonth + i] = (i + 1).toString()
  }

  return (
    <div>
      <div className={styles.filterWrapper}>
        <div className={styles.filter}>
          <div className={styles.filterItem}>
            <div className={styles.filterItemInput}>
              <input type="button" value="Filter 1" />
            </div>
            <div className={styles.filterItemInput}>
              <input type="button" value="Filter 2" />
            </div>
            <div className={styles.filterItemInput}>
              <input type="button" value="Filter 3" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.calendarWrapper}>
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarHeaderItem}>
              <h1 className={styles.calendarMonth}>{selectedMonth}</h1>
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
                  <div className={styles.calendarGridItem}>
                    <div
                      className={
                        selectedDay === index
                          ? styles.calendarGridItemDaySelected
                          : styles.calendarGridItemDay
                      }
                      key={index}
                    >
                      <div className={styles.calendarGridItemDayCircle}>
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg%22%3E">
                          <circle cx="100" cy="100" r="75" />
                        </svg>
                        <h6 className={styles.calendarGridItemDayText}>{day}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
