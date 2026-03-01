import { Badge } from '@timui/react'

export default function Component() {
  return (
    <Badge>
      <svg
        className="-ms-0.5 opacity-60"
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
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      Badge
    </Badge>
  )
}
