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
//     {name: 'sideGames', title: 'Side Games', type: 'reference', to: [{type: 'sideGames'}]},
//     {
//       name: 'pointsRaces',
//       title: 'Points Races',
//       type: 'array',
//       of: [{type: 'reference', to: [{type: 'pointsValues'}]}],
//     },
//     {name: 'memberStatus', title: 'Member Status', type: 'array', of: [{type: 'string'}]},
//     {name: 'sideGamesOptions', title: 'Side Games Options', type: 'array', of: [{type: 'string'}]},
//     {name: 'tees', title: 'Tees', type: 'array', of: [{type: 'string'}]},
//   ],
// }

const Events = () => `*[_type == "events"] {
  _id,
  title,
  date,
  "locations": *[_type == "locations"] {
    _id,
    title,
  },
  "cost": *[_type == "eventFee"] {
    _id,
    title,
    plus,
    basic,
    guest,
  },
  "sideGames": *[_type == "sideGames"] {
    _id,
    title,
    fee,
    games,
  },
  "pointsRaces": *[_type == "pointsValues"] {
    _id,
    title,
    par,
    birdie,
    eagle,
    dblEagle,
holeInOne,
  },
  memberStatus,
  sideGamesOptions,
  tees
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
