import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} disabled />
      <Label htmlFor={id}>Disabled checkbox</Label>
    </div>
  )
}
