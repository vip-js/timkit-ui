import { Avatar, AvatarFallback } from '@timui/react'

export default function Component() {
  return (
    <Avatar>
      <AvatarFallback>
        <svg
          className="size-4 opacity-60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      </AvatarFallback>
    </Avatar>
  )
}
