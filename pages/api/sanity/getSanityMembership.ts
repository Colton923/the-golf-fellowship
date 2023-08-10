import { NextApiRequest, NextApiResponse } from 'next'
import client from 'lib/sanity/client'

const Memberships = () => `*[_type == "memberships"] {
  _id,
  title,
}`

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const plan = capitalizeFirstLetter(req.body.plan) || 'Player'
      const query = Memberships()
      const result = await client.fetch(query)
      const membership = result.find(
        (m: any) =>
          m.title.toUpperCase().slice(0, 5) === plan.toUpperCase().slice(0, 5)
      )
      res.status(200).json({ membership })
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.status(404).json({ error: 'Not found' })
  }
}
