import { useId } from "react"
import { Input, Label } from "@timkit/web"

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>
        Required input <span className="text-destructive">*</span>
      </Label>
      <Input id={id} placeholder="Email" type="email" required />
    </div>
  )
}
