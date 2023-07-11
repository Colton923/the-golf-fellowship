import client from 'lib/sanity/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const eventData = req.body

      const location = await client.create({
        _type: 'locations',
        title: eventData.location.title,
      })

      // Create eventFee
      const cost = await client.create({
        _type: 'eventFee',
        title: eventData.cost[0].title,
        plus: eventData.cost[0].plus,
        basic: eventData.cost[0].basic,
        guest: eventData.cost[0].guest,
      })

      // Create sideGames
      const sideGames = await client.create({
        _type: 'sideGames',
        title: eventData.sideGames[0].title,
        fee: eventData.sideGames[0].fee,
        games: eventData.sideGames[0].games,
      })

      // Create pointsValues
      const pointsRaces = await Promise.all(
        eventData.pointsRaces.map((race: any) =>
          client.create({
            _type: 'pointsValues',
            title: race.title,
            par: race.par,
            birdie: race.birdie,
            eagle: race.eagle,
            dblEagle: race.dblEagle,
            holeInOne: race.holeInOne,
          })
        )
      )

      // Create the event
      const event = await client.create({
        _type: 'events',
        title: eventData.title,
        date: eventData.date,
        location: { _ref: location._id },
        cost: { _ref: cost._id },
        sideGames: { _ref: sideGames._id },
        pointsRaces: pointsRaces.map((race) => ({ _ref: race._id })),
        memberStatus: eventData.memberStatus,
        sideGamesOptions: eventData.sideGamesOptions,
        tees: eventData.tees,
      })

      res.status(200).json(event)
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
