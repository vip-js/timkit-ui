import { Button } from '@timui/react'
import { EllipsisIcon, FilesIcon, FilmIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant="outline"
      >
        <FilesIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Files
      </Button>
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant="outline"
      >
        <FilmIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Media
      </Button>
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant="outline"
        size="icon"
        aria-label="Menu"
      >
        <EllipsisIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}
