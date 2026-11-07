import { Alert, AlertDescription } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Alert onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="rounded-md border border-emerald-500/50 px-4 py-3 text-emerald-600">
      <div className="flex gap-3">
        <span className="me-3 -mt-0.5 inline-flex opacity-60" aria-hidden="true">
          !
        </span>
        <AlertDescription className="text-sm text-current">
          Completed successfully!
        </AlertDescription>
      </div>
    </Alert>
  )
}
