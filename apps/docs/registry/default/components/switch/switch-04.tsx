import { useId } from 'react'

import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'

export default function Component() {
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <Switch id={id} disabled />
      <Label htmlFor={id} className="sr-only">
        Disabled
      </Label>
    </div>
  )
}
