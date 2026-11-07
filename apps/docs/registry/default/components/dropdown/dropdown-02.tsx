import { useState } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@timui/react'
import { ChevronDownIcon } from 'lucide-react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">
          Same width of trigger
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuItem>Option 3</DropdownMenuItem>
        <DropdownMenuItem>Option 4</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
