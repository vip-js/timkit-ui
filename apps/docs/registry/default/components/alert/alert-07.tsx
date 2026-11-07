import { Alert, AlertDescription } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Alert onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="rounded-md border px-4 py-3">
      <div className="flex gap-3">
        <span className="me-3 -mt-0.5 inline-flex text-blue-500" aria-hidden="true">
          !
        </span>
        <AlertDescription className="text-sm text-current">Just a quick note!</AlertDescription>
      </div>
    </Alert>
  )
}
