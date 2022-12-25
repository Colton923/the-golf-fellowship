const admin = process.env.NEXT_PUBLIC_GOLF_GENIUS_KEY

export type GetEvents = {
  page?: string
  season_id?: string
  category_id?: string
  directory_id?: string
  archived?: boolean
}

const handler = async (req: GetEvents) => {
  const { page, season_id, category_id, directory_id, archived } = req
  const pageQuery = page ? `?page=${page}` : ''
  const seasonIdQuery = season_id ? `&season=${season_id}` : ''
  const categoryIdQuery = category_id ? `&category=${category_id}` : ''
  const directoryIdQuery = directory_id ? `&directory=${directory_id}` : ''
  const archivedQuery = archived ? `&archived=${archived}` : ''
  const url = `https://www.golfgenius.com/api_v2/${admin}/events${pageQuery}${seasonIdQuery}${categoryIdQuery}${directoryIdQuery}${archivedQuery}`

  try {
    const res = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    return data
  } catch (error: any) {
    return error
  }
}

export default handler
