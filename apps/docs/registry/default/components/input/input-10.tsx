import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { MailIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with end icon</Label>
      <div className="relative">
        <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} className="peer pe-9" placeholder="Email" type="email" />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
          <MailIcon size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
