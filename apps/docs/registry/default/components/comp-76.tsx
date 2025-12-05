import { useId } from "react"
import { Label, Textarea } from "@timkit/web"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Read-only textarea</Label>
      <Textarea
        id={id}
        className="read-only:bg-muted"
        defaultValue="This is a read-only textarea"
        readOnly
        placeholder="Leave a comment"
      />
    </div>
  )
}
