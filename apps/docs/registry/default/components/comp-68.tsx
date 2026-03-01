import { useId } from 'react'
import { AccordionTrigger, Button, Label, Textarea } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with left button</Label>
      <Textarea id={id} placeholder="Leave a comment" />
      <Button variant="outline">Send</Button>
    </div>
  )
}
