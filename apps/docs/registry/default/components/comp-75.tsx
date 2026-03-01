import { useId } from 'react'
import { AccordionTrigger, Label, Textarea } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with no resize</Label>
      <Textarea id={id} className="[resize:none]" placeholder="Leave a comment" />
    </div>
  )
}
