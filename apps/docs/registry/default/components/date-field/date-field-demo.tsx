'use client'

import { useState } from 'react'
import { DateField, DateInput } from '@timui/react'

export default function DateFieldDemo() {
  const [value, setValue] = useState('2026-11-07')
  return (
    <DateField value={value} onValueChange={setValue}>
      <DateInput aria-label="Date" />
      <p>{value || 'Empty'}</p>
      <button type="button" onClick={() => setValue('')}>
        Clear
      </button>
    </DateField>
  )
}
