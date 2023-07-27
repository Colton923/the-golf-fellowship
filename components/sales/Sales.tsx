'use client'

import { Container } from '@mantine/core'
import SalesBadge from './salesBadge/SalesBadge'

export default function Sales() {
  return (
    <Container w={300}>
      <SalesBadge
        color="rgb(139,0,0)"
        text1="AUG 7 - 1:00 TT"
        text2="DFW"
        text3="TPC SAWGRASS"
        middleTextSize="20px"
        tint="500"
        middleTextFontSize="30px"
        middleTextFontStretch="5"
      />
    </Container>
  )
}
