import { useId } from 'react'
import { Label, Textarea } from '@timui/react'

export default function Component() {
  const id = useId()

  return (
    <div className="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 relative rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50">
      <Label htmlFor={id} className="text-foreground block px-3 pt-2 text-xs font-medium">
        Textarea with inset label
      </Label>
      <Textarea id={id} className="min-h-[70px] rounded-none border-0 px-3 pb-2 shadow-none" />
    </div>
  )
}
