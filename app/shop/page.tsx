'use client'

import { useSiteContext } from '@components/context/Context'
import Sales from '@components/sales/Sales'
import { Container, Space } from '@mantine/core'

// const data = await getEvents()

// export async function getEvents() {
//   const res = await fetch('/api/sanity/getEvents', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })

//   if (!res.ok) {
//     throw new Error(res.statusText)
//   }

//   return res.json()
// }
// console.log(data)

// if (!data) {
//   return null
// }

export default function Page() {
  const { user, loading, error, router } = useSiteContext()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return (
      <Container size={'xl'} p={'xl'} m={'xl'}>
        <Space h={'500px'} />
        <Sales />
      </Container>
    )
  } else {
    router.push('/membership')
    return null
  }
}
