import { Alert, AlertDescription } from '@timui/react'

export default function Component() {
  return (
    <Alert className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
      <div className="flex gap-3">
        <span className="me-3 -mt-0.5 inline-flex opacity-60" aria-hidden="true">
          !
        </span>
        <AlertDescription className="text-sm text-current">
          Some information is missing!
        </AlertDescription>
      </div>
    </Alert>
  )
}
