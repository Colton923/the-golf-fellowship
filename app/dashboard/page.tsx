'use client'

import Account from '@components/account/Account'
import Purchases from '@components/account/myPurchases/Purchases'
import { Receipts } from '@components/data/Receipts'
import { useSiteContext } from '@components/context/Context'
import { Container, Flex, Badge, Space } from '@mantine/core'
import Sales from '@components/sales/Sales'
import PlayerCard from '@components/playerCard/PlayerCard'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function Page() {
  const { isAdmin, myUserData } = useSiteContext()
  const [accountPath, setAccountPath] = useState(false)
  const [purchasesPath, setPurchasesPath] = useState(false)
  const [receiptsPath, setReceiptsPath] = useState(false)
  const [propshopPath, setPropshopPath] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const path = searchParams?.get('component')
    if (!path) {
      setAccountPath(false)
      setPurchasesPath(false)
      setReceiptsPath(false)
      setPropshopPath(false)
      return
    }
    if (path.includes('account')) {
      setAccountPath(true)
    } else {
      setAccountPath(false)
    }
    if (path.includes('purchases')) {
      setPurchasesPath(true)
    } else {
      setPurchasesPath(false)
    }
    if (path.includes('receipts')) {
      setReceiptsPath(true)
    } else {
      setReceiptsPath(false)
    }
    if (path.includes('proshop')) {
      setPropshopPath(true)
    } else {
      setPropshopPath(false)
    }
  }, [searchParams])

  return (
    <Container bg={'light'} mih={'100vh'}>
      <Space h={'100px'} />
      <Flex pt={'xl'} direction="column" align="center" justify="center">
        <PlayerCard
          first={myUserData?.firstName || 'A'}
          last={myUserData?.lastName || 'A'}
          id={myUserData?.uid.slice(0, 6) || '000'}
          plus={myUserData?.membership.plan === 'plus' ? true : false}
        >
          <Flex align="center" justify="center" wrap={'wrap'} p={'xs'}>
            {myUserData?.membership.city && (
              <Badge m={'1px'} color="light" variant="outline">
                {myUserData?.membership.city}
              </Badge>
            )}
            {myUserData?.membership.plan && (
              <Badge m={'1px'} color="light" variant="outline">
                {myUserData?.membership.plan}
              </Badge>
            )}
          </Flex>
        </PlayerCard>
        <Container size="xl" miw={'80vw'} p={'xs'}>
          {isAdmin && receiptsPath && <Receipts />}
          {accountPath && <Account />}
          {purchasesPath && <Purchases />}
          {propshopPath && <Sales />}
        </Container>
      </Flex>
    </Container>
  )
}
