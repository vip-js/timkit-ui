import { useId } from 'react'
import { Label, Textarea } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Shorter textarea</Label>
      <Textarea value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} className="min-h-0" placeholder="Leave a comment" rows={2} />
    </div>
  )
}
