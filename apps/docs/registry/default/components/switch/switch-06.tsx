import { useId } from 'react'

import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'

export default function Component() {
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        id={id}
        className="[&_span]:border-input h-3 w-9 border-none outline-offset-[6px] [&_span]:border"
      />
      <Label htmlFor={id} className="sr-only">
        M2-style switch
      </Label>
    </div>
  )
}
