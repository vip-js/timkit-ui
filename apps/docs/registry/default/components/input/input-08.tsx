import { useId } from 'react'
import { Input, Label } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Disabled input</Label>
      <Input id={id} placeholder="Email" type="email" disabled />
    </div>
  )
}
