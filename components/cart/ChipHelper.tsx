'use client'

import { useState } from 'react'
import { Chip } from '@mantine/core'

export type ChipHelperProps = {
  fn: () => void
  color: string
  variant: string
  label: string
  handleNewSideGame: (sideGame: string) => void
}

const ChipHelper = (props: ChipHelperProps) => {
  const { fn, color, variant, label, handleNewSideGame } = props
  const [selected, setSelected] = useState<boolean>(false)

  const handleSelect = () => {
    setSelected(!selected)
    fn()
    handleNewSideGame(label)
  }

  return (
    <>
      <Chip
        p={'1px'}
        m={'1px'}
        checked={selected}
        onChange={() => {
          handleSelect()
        }}
        color={color}
        variant={variant}
        style={{
          cursor: 'pointer',
          fontSize: '10px',
        }}
      >
        {label}
      </Chip>
    </>
  )
}

export default ChipHelper
