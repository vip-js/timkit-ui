import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id} className="peer-data-[state=checked]:line-through">
        Simple todo item
      </Label>
    </div>
  )
}
