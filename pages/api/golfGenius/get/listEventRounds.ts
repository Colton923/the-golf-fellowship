// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'

type GetAllEventRounds = {
  event_id: number
}

const handler = async (req: GetAllEventRounds, res: any) => {
  const { event_id } = req
  const url = `https://www.golfgenius.com/api_v2/${admin}/events/${event_id}/rounds`

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
