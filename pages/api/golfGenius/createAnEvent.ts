// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'
const url =
  'https://private-anon-66a16ba070-golfgeniusapiv2.apiary-mock.com/api_v2/events'

const handler = async (req: any, res: any) => {
  const newEvent = req.body
  console.log(newEvent)
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
    res
      .status(500)
      .json({ statusCode: 500, message: error.message })
    return error
  }
}

export default handler
