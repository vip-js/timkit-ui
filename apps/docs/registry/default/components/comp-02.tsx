import { useId } from 'react'
import { AccordionTrigger, Input, Label } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>
        Required input <span className="text-destructive">*</span>
      </Label>
      <Input id={id} placeholder="Email" type="email" required />
    </div>
  )
}
