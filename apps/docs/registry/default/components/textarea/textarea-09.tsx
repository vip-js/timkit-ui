import { useId } from 'react'
import { Label, Textarea } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Disabled textarea</Label>
      <Textarea value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} disabled placeholder="Leave a comment" />
    </div>
  )
}
