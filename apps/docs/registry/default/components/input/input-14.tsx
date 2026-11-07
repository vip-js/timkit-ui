import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with start add-on</Label>
      <div className="flex rounded-md shadow-xs">
        <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
          https://
        </span>
        <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)}
          id={id}
          className="-ms-px rounded-s-none shadow-none"
          placeholder="google.com"
          type="text"
        />
      </div>
    </div>
  )
}
