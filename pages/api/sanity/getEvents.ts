import client from 'lib/sanity/client'
// import urlFor from 'lib/sanity/urlFor'
import type { NextApiRequest, NextApiResponse } from 'next'
// example
// export default {
//   name: 'events',
//   title: 'Events',
//   type: 'document',
//   fields: [
//     {name: 'title', title: 'Title', type: 'string'},
//     {name: 'date', title: 'Date', type: 'datetime'},
//     {name: 'location', title: 'Location', type: 'reference', to: [{type: 'locations'}]},
//     {name: 'cost', title: 'Cost', type: 'reference', to: [{type: 'eventFee'}]},
//     {name: 'eventType', title: 'Event Type', type: 'reference', to: [{type: 'eventTypes'}]},
//     {
//       name: 'sideGames',
//       title: 'Side Games',
//       type: 'array',
//       of: [{type: 'reference', to: [{type: 'sideGames'}]}],
//     },
//     {name: 'tees', title: 'Tees', type: 'array', of: [{type: 'reference', to: [{type: 'tees'}]}]},
//     {name: 'description', title: 'Description', type: 'array', of: [{type: 'string'}]},
//     {name: 'inclusions', title: 'Inclusions', type: 'array', of: [{type: 'string'}]},
//   ],
// }

const Events = () => `*[_type == "events"] {
  _id,
  title,
  date,
  location,
  cost,
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
      res.status(200).json(events)
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
