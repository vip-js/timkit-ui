import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)} id={id} defaultChecked />
      <Label htmlFor={id} className="peer-data-[state=checked]:line-through">
        Simple todo item
      </Label>
    </div>
  )
}
