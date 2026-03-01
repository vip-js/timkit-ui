import { useId } from 'react'
import { AccordionTrigger, Button, Label, Textarea } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with right button</Label>
      <Textarea id={id} placeholder="Leave a comment" />
      <div className="flex justify-end">
        <Button variant="outline">Send</Button>
      </div>
    </div>
  )
}
