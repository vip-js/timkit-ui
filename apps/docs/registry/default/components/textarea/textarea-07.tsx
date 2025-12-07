import { useId } from 'react'

import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with gray background</Label>
      <Textarea
        id={id}
        className="bg-muted border-transparent shadow-none"
        placeholder="Leave a comment"
      />
    </div>
  )
}
