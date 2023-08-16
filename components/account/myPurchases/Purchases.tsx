'use client'

import type { NewPurchase } from '@components/context/Context'

import { auth, db } from '../../../firebase/firebaseClient'
import {
  Card,
  Flex,
  Group,
  Text,
  Title,
  Badge,
  Skeleton,
  Center,
  Space,
} from '@mantine/core'

import { useSiteContext } from '@components/context/Context'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

const Purchases = () => {
  const [purchases, setPurchases] = useState<NewPurchase[] | null>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { user, HandleUserPurchase } = useSiteContext()

  useEffect(() => {
    if (!user) return
    if (!loading) return
    const unsubscribe = getDocs(collection(db, 'users', user.uid, 'purchases')).then(
      (snapshot) => {
        const purchases: NewPurchase[] = []
        snapshot.forEach((doc) => {
          purchases.push(doc.data() as NewPurchase)
        })
        setPurchases(purchases)
      }
    )

    const Handler = async () => {
      await unsubscribe.then(() => {
        setLoading(false)
      })
    }
    Handler()
  }, [user, purchases, loading, HandleUserPurchase])

  if (loading) {
    return (
      <Flex justify="center" align="center">
        <Group>
          <Skeleton h={'30px'} w={'100%'} />
          <Skeleton h={'30px'} w={'100%'} />
          <Skeleton h={'30px'} w={'100%'} />
          <Center>
            <Text>loading...</Text>
          </Center>
          <Space h={20} />
        </Group>
      </Flex>
    )
  }

  if (!purchases) {
    return (
      <Flex direction={'column'} justify="center" align="center">
        <Center>
          <Text>
            This is where you can see your purchases. Please visit the Pro Shop to
            see what is in store.
          </Text>
        </Center>
      </Flex>
    )
  }

  return (
    <Flex direction={'column'} justify={'center'} p={'xs'}>
      <Text>Purchases</Text>
      {purchases.map((purchase, index) => {
        return (
          <Group key={index + 'transition-purchase'} m={'xs'}>
            <Card shadow="sm" padding="sm">
              <Flex justify="space-between" align="center" wrap={'wrap'}>
                {purchase.cart.map((item, index) => {
                  return (
                    <Flex key={'purchase' + index + item.id} p={'xs'}>
                      <Text>{item.item.event.title}</Text>
                      <Text>{item.item.event.date}</Text>
                    </Flex>
                  )
                })}
                <Flex>
                  <Badge variant="outline" color="green">
                    {purchase.total}
                  </Badge>
                </Flex>
              </Flex>
            </Card>
          </Group>
        )
      })}
    </Flex>
  )
}

export default Purchases
