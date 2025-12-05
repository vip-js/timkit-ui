import { useId } from "react"
import { Button, Label, Textarea } from "@timkit/web"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with button</Label>
      <Textarea id={id} placeholder="Leave a comment" />
      <Button variant="outline" className="w-full">
        Send
      </Button>
    </div>
  )
}
