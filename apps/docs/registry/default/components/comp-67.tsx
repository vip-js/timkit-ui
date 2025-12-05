import { useId } from "react"
import { Label, Textarea } from "@timkit/web"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Disabled textarea</Label>
      <Textarea id={id} disabled placeholder="Leave a comment" />
    </div>
  )
}
