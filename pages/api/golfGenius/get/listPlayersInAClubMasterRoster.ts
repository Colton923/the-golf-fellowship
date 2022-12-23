// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'

type GetMasterRoster = {
  page?: number
  photo?: boolean
}

const handler = async (req: GetMasterRoster, res: any) => {
  const { page, photo } = req
  const pageQuery = page ? `?page=${page}` : ''
  const photoQuery = photo ? `&photo=${photo}` : ''
  const url = `https://www.golfgenius.com/api_v2/${admin}/master_roster${pageQuery}${photoQuery}`
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
