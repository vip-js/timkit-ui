import { Button } from '@timui/react'
import { PrinterIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">
      <PrinterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
      Print
      <kbd className="bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
        ⌘P
      </kbd>
    </Button>
  )
}
