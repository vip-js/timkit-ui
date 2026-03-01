import { useId } from 'react'
import { Badge, Checkbox } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <Badge className="has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative outline-none has-focus-visible:ring-[3px]">
      <Checkbox id={id} className="peer sr-only after:absolute after:inset-0" defaultChecked />
      <svg
        className="hidden peer-data-[state=checked]:block"
        width={12}
        height={12}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <label htmlFor={id} className="cursor-pointer select-none after:absolute after:inset-0">
        Selectable
      </label>
    </Badge>
  )
}
