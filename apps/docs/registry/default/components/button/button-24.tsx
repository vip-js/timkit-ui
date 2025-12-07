'use client'

import { useState } from 'react'
import { BookmarkIcon } from 'lucide-react'

import { Toggle } from '../../ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'

export default function Component() {
  const [bookmarked, setBookmarked] = useState<boolean>(false)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Toggle
              className="group size-9 p-0 hover:bg-indigo-50 hover:text-indigo-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-500"
              aria-label="BookmarkIcon this"
              pressed={bookmarked}
              onPressedChange={setBookmarked}
            >
              <BookmarkIcon size={16} aria-hidden="true" />
            </Toggle>
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          <p>{bookmarked ? 'Remove bookmark' : 'BookmarkIcon this'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
