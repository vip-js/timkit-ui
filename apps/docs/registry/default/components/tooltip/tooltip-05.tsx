import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/react'
import { GlobeIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" size="sm">
            W/ icon
          </Button>
        </TooltipTrigger>
        <TooltipContent className="dark py-3">
          <div className="flex gap-3">
            <GlobeIcon className="mt-0.5 shrink-0 opacity-60" size={16} aria-hidden="true" />
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
