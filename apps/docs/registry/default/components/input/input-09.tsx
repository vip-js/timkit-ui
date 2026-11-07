import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { AtSignIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with start icon</Label>
      <div className="relative">
        <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} className="peer ps-9" placeholder="Email" type="email" />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <AtSignIcon size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
