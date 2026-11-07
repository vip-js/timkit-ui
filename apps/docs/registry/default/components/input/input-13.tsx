import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with inline add-ons</Label>
      <div className="relative">
        <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} className="peer ps-6 pe-12" placeholder="0.00" type="text" />
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
          €
        </span>
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
          EUR
        </span>
      </div>
    </div>
  )
}
