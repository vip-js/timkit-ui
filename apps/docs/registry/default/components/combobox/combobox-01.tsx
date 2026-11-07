'use client'

import { useState } from 'react'
import { Combobox, ComboboxControl, ComboboxInput, ComboboxItem, ComboboxList } from '@timui/react'

const options = ['Apple', 'Orange', 'Grape']

export default function Component() {
  const [value, setValue] = useState('')
  return (
    <Combobox className="w-64" value={value} onValueChange={(event) => setValue(String(event?.value ?? ''))}>
      <ComboboxControl>
        <ComboboxInput className="w-full" placeholder="Pick a fruit" />
      </ComboboxControl>
      <ComboboxList>
        {options.map((option) => (
          <ComboboxItem key={option} value={option}>{option}</ComboboxItem>
        ))}
      </ComboboxList>
    </Combobox>
  )
}
