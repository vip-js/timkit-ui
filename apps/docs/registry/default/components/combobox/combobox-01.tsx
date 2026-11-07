'use client'

import { useState } from 'react'
import { Combobox, ComboboxControl, ComboboxInput, ComboboxItem, ComboboxList } from '@timui/react'

const options = ['Apple', 'Orange', 'Grape']

export default function Component() {
  const [value, setValue] = useState('')
  return (
    <Combobox
      id="fruit-combobox"
      className="w-64"
      value={value ? [value] : []}
      onValueChange={(event) => setValue(event.detail.value[0] ?? '')}
    >
      <ComboboxControl>
        <ComboboxInput className="w-full" placeholder="Pick a fruit" />
      </ComboboxControl>
      <ComboboxList>
        {options.map((option) => (
          <ComboboxItem key={option} item={{ value: option, label: option }}>
            {option}
          </ComboboxItem>
        ))}
      </ComboboxList>
    </Combobox>
  )
}
