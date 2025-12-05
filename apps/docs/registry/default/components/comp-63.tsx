import { useId } from "react"
import { Label, Textarea } from "@timkit/web"

export default function Component() {
  const id = useId()
  return (
    <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
      <Label htmlFor={id}>Textarea with colored border and ring</Label>
      <Textarea id={id} placeholder="Leave a comment" />
    </div>
  )
}
