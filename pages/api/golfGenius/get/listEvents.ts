// const admin = process.env.GOLF_GENIUS_KEY
const admin = 'api-test-key'
type GetEvents = {
  page?: number
  season_id?: number
  category_id?: number
  directory_id?: number
  archived?: boolean
}

const handler = async (req: GetEvents, res: any) => {
  const { page, season_id, category_id, directory_id, archived } = req
  const pageQuery = page ? `?page=${page}` : ''
  const seasonIdQuery = season_id ? `&season=${season_id}` : ''
  const categoryIdQuery = category_id ? `&category=${category_id}` : ''
  const directoryIdQuery = directory_id ? `&directory=${directory_id}` : ''
  const archivedQuery = archived ? `&archived=${archived}` : ''
  const url = `https://www.golfgenius.com/api_v2/${admin}/events${pageQuery}${seasonIdQuery}${categoryIdQuery}${directoryIdQuery}${archivedQuery}`

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
