import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with gray background</Label>
      <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)}
        id={id}
        className="bg-muted border-transparent shadow-none"
        placeholder="Email"
        type="email"
      />
    </div>
  )
}
