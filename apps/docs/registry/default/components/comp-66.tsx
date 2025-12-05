import { useId } from "react"
import { Label, Textarea } from "@timkit/web"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Shorter textarea</Label>
      <Textarea
        id={id}
        className="min-h-0"
        placeholder="Leave a comment"
        rows={2}
      />
    </div>
  )
}
