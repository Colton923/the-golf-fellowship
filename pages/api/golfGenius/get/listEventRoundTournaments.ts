// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'

type GetEventRoundTournaments = {
  event_id: number
  round_id: number
}

const handler = async (req: GetEventRoundTournaments, res: any) => {
  const { event_id, round_id } = req
  const eventIdQuery = event_id ? `/${event_id}` : ''
  const roundIdQuery = round_id ? `/${round_id}` : ''
  const url = `https://www.golfgenius.com/api_v2/${admin}/events${eventIdQuery}/rounds${roundIdQuery}/tournaments`

  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${admin}`,
      },
    })
    const data = await response.json()
    res.status(200).json(data)
    return data
  } catch (error: any) {
    res.status(500).json({ statusCode: 500, message: error.message })
    return error
  }
}

export default handler
