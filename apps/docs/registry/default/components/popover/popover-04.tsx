import { Button, Popover, PopoverContent, PopoverTrigger } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">Tooltip-like popover</Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[280px] py-3 shadow-none" side="top">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[13px] font-medium">Popover with button</p>
            <p className="text-muted-foreground text-xs">
              I am a popover that would like to look like a tooltip. I can&lsquo;t be a tooltip
              because of the interactive element inside me.
            </p>
          </div>
          <Button size="sm" className="h-7 px-2">
            Know more
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
