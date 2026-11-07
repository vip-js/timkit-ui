import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-2">
      <Checkbox checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)} id={id} className="order-1" />
      <Label htmlFor={id}>Right aligned checkbox</Label>
    </div>
  )
}
