import client from 'lib/sanity/client'
// import urlFor from 'lib/sanity/urlFor'
import type { NextApiRequest, NextApiResponse } from 'next'
export interface Event {
  _id: string
  title: string
  date: string
  description: string[]
  tees: Tees[]
  inclusions: string[]
  location: Location
  cost: Cost
  eventType: EventType
  sideGames: SideGame[]
}

export interface Tees {
  title: string
  description: string
}

export interface Location {
  title: string
  default9Fee: number
  default18Fee: number
  description: string
}

export interface Cost {
  title: string
  feePerMembership: FeePerMembership[]
}

export interface FeePerMembership {
  _key: string
  fee: number
  membership: Membership
}

export interface Membership {
  _ref: string
  _type: string
}

export interface EventType {
  title: string
  description: string
  defaultFee: number
}

export interface SideGame {
  title: string
  fee: number
  description: string
  membersOnly: boolean
}

const Events = () => `*[_type == "events"] {
  _id,
  title,
  date,
  location->{title, default9Fee, default18Fee, description},
  cost->{title, feePerMembership[]},
  eventType->{title, description, defaultFee},
  sideGames[]->{title, fee, description, membersOnly},
  tees[]->{title, description},
  description,
  inclusions,
}`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const events = await client.fetch(Events())
      console.log('events', JSON.stringify(events, null, 2))
      res.status(200).json(events)
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
