import { NextApiRequest, NextApiResponse } from 'next'
import client from 'lib/sanity/client'

const Event = (slug: string) => `*[_type == "events" && _id == "${slug}"] {
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
  playingPartnerRequest,
  image
}`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const event = await client.fetch(Event(req.body.slug))
      res.status(200).json(event)
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
