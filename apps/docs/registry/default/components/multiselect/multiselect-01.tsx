'use client'

import { useState } from 'react'
import { MultipleSelector } from '@timui/react'

const options = [
  { value: 'design', label: 'Design' },
  { value: 'code', label: 'Code' },
]

export default function Component() {
  const [value, setValue] = useState<Array<{ value: string; label: string }>>([])
  return (
    <MultipleSelector
      className="w-72"
      value={value}
      defaultOptions={options}
      placeholder="Select skills"
      onChange={setValue}
    />
  )
}
