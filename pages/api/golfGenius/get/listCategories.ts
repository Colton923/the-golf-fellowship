// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'

const handler = async (res: any) => {
  const url = `https://www.golfgenius.com/api_v2/${admin}/categories`

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
