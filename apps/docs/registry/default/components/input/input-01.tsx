import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Simple input</Label>
      <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} placeholder="Email" type="email" />
    </div>
  )
}
