import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" size="sm">
            W/ image
          </Button>
        </TooltipTrigger>
        <TooltipContent className="py-3">
          <div className="space-y-2">
            <img
              className="w-full rounded"
              src="/dialog-content.png"
              width={382}
              height={216}
              alt="Content image"
            />
            <div className="space-y-1">
              <p className="text-[13px] font-medium">Tooltip with title and icon</p>
              <p className="text-muted-foreground text-xs">
                Tooltips are made to be highly customizable, with features like dynamic placement,
                rich content, and a robust API.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
