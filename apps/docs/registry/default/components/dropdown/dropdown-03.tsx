import { useState } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@timui/react'
import { BoltIcon, ChevronDownIcon, CopyPlusIcon, FilesIcon, Layers2Icon } from 'lucide-react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">
          Menu with icons
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <CopyPlusIcon size={16} className="opacity-60" aria-hidden="true" />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
          Group
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FilesIcon size={16} className="opacity-60" aria-hidden="true" />
          Clone
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
