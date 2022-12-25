const admin = process.env.NEXT_PUBLIC_GOLF_GENIUS_KEY
//const admin = 'api-test-key'

const handler = async (req: any) => {
  const id = req
  const url = `https://www.golfgenius.com/api_v2/${admin}/events/${id}/rounds`
  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    return data
  } catch (error: any) {
    return error
  }
}

export default handler
