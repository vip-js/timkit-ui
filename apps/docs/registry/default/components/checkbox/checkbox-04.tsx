import { useId, useState } from 'react'
import { Checkbox, Label } from '@timui/react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={demoChecked}
        onCheckedChange={(event) => setDemoChecked(event.detail.checked === true)}
        id={id}
        disabled
      />
      <Label htmlFor={id}>Disabled checkbox</Label>
    </div>
  )
}
