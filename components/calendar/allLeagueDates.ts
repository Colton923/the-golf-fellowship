import handler from '../../pages/api/listEvents'
import type { GetEvents } from '../../pages/api/listEvents'

type event = {
  category: {
    id: number
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
    id: number
    name: string
  }
  start_date: string
  type: string
  website: string
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

export default async function getAllLeagueDates(
  findMonth: number,
  findYear: number
) {
  const params: GetEvents = {
    archived: false,
  }

  const data = await handler(params).then((res) => {
    if (res.error) {
      return res
    }
    const AllLeagueDates: AllLeagueDates = res.map((item: any) => {
      const event: event = item.event
      if (
        event.end_date === null ||
        event.start_date === null ||
        event.end_date === undefined ||
        event.start_date === undefined
      ) {
        return
      }
      const dateStart = event.start_date.split('-')
      const year = dateStart[0]
      const month = dateStart[1]
      const day = dateStart[2]
      const startDate = `${month}/${day}/${year}`

      const dateEnd = event.end_date.split('-')
      const yearEnd = dateEnd[0]
      const monthEnd = dateEnd[1]
      const dayEnd = dateEnd[2]
      const endDate = `${monthEnd}/${dayEnd}/${yearEnd}`

      const dateDiff = new Date(endDate).getTime() - new Date(startDate).getTime()
      const days = dateDiff / (1000 * 3600 * 24)

      const dateArray = []
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const year = date.getFullYear()
        if (findMonth + 1 === month && findYear === year) {
          const dateString = `${month}/${day}/${year}`
          dateArray.push({ date: dateString })
        }
      }
      if (dateArray.length === 0) {
        return
      }
      return {
        dates: dateArray,
        name: event.name,
      }
    })
    const filtered = AllLeagueDates.filter((item) => item !== undefined)
    return filtered
  })

  return data
}
