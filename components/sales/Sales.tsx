'use client'

import { Container, Skeleton } from '@mantine/core'
import SalesBadge from './salesBadge/SalesBadge'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Sales() {
  const [salesData, setSalesData] = useState([])
  useEffect(() => {
    async function getEvents() {
      const res = await fetch('/api/sanity/getEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return res.json()
    }
    const DataSetter = async () => {
      const data = await getEvents()
      console.log('data', data)
      setSalesData(data)
    }
    DataSetter()
  }, [])

  if (salesData.length === 0) {
    return (
      <Container w={300}>
        <Skeleton height={300} />
      </Container>
    )
  }
  return (
    <Container w={150} m={0} p={0}>
      {salesData.map((sale: any, index: number) => {
        const color = `rgb(${Math.abs(
          Math.floor(139 + Math.random() * 100 * (index + 1) - 255)
        )},${Math.abs(
          Math.floor(0 + Math.random() * 100 * (index + 1) - 255)
        )},${Math.abs(Math.floor(0 + Math.random() * 100 * (index + 1) - 255))})`
        return (
          <Link href={`/shop/${sale._id}`} key={index}>
            <SalesBadge
              color={color}
              text1={sale.title}
              text2={sale.location.description.toUpperCase()}
              text3={sale.location.title}
              middleTextSize="10px"
              tint="300"
              middleTextFontSize="30px"
              middleTextFontStretch="5"
              uniqueKey={index.toString().concat(sale._id)}
            />
          </Link>
        )
      })}
    </Container>
  )
}
