// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'

const handler = async (req: any, res: any) => {
  const url = 'https://www.golfgenius.com/api_v2/events'

  const newEvent = req.body
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${admin}`,
      },
      body: JSON.stringify(newEvent),
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
