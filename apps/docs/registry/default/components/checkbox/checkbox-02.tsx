'use client'

import { useId, useState } from 'react'
import { Checkbox, Label } from '@timui/react'

export default function Component() {
  const id = useId()
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate')

  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(event) => setChecked(event.detail.checked)} />
      <Label htmlFor={id}>Indeterminate checkbox</Label>
    </div>
  )
}
