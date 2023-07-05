import leagueHandler from '../../pages/api/golfGenius/get/listEvents'
import eventHandler from '../../pages/api/golfGenius/get/listEventRounds'
import type { GetEvents } from '../../pages/api/golfGenius/get/listEvents'

type Event = {
  category: {
    id: string
    name: string
  }
  deleted: boolean
  description: string
  directories: [Record<string, string>]
  end_date: string
  external_id: string
  ggid: string
  id: string
  location: {
    city: string
    country: string
    state: string
  }
  name: string
  registration_status: string
  season: {
    current: boolean
    id: string
    name: string
  }
  start_date: string
  type: string
  website: string
}

type EventRound = {
  id: string
  event_id: string
  index: string
  name: string
  date: string
  status: string
  pairing_group_size: string
  most_recent: boolean
  type: string
  playing_divisions: [id: string]
  external_id: string
  settings: {
    allow_handicap_updates: boolean
    mobile_score_entry_enabled: boolean
    attending_by_default: boolean
    teesheet_released: boolean
    results_released: boolean
  }
}

type AllLeagueDates = [
  {
    dates: [
      {
        date: string
      }
    ]
    name: string
  }
]

export default async function getAllEventDates(findMonth: number, findYear: number) {
  const params: GetEvents = {
    archived: false,
  }
  const leagueArray: string[] = []
  const dateArray: any[] = []
  const data = await leagueHandler(params).then((res) => {
    if (res.error) {
      return res
    }
    res.map((item: any) => {
      const event: Event = item.event
      if (
        event.end_date === null ||
        event.start_date === null ||
        event.end_date === undefined ||
        event.start_date === undefined
      ) {
        return
      }
      leagueArray.push(event.id)
    })
    return leagueArray
  })
  const eachRound = async (id: string) => {
    await eventHandler(id).then((res) => {
      if (res.error) {
        return res
      }
      res.map((item: any) => {
        const round: EventRound = item.round
        const roundDate = round.date.split('-')
        const roundYear = roundDate[0]
        const roundMonth = roundDate[1]
        const roundDay = roundDate[2]

        if (
          parseInt(roundYear) === findYear &&
          parseInt(roundMonth) === findMonth + 1
        ) {
          console.log('found')
          const dateString = `${roundMonth}/${roundDay}/${roundYear}`
          dateArray.push({
            date: dateString,
            name: round.name,
            divisions: round.playing_divisions,
          })
        } else {
        }
      })
      return dateArray
    })
  }
  const allRounds = async () => {
    await Promise.all(data.map((id: string) => eachRound(id)))
  }
  await allRounds()
  return dateArray
}
