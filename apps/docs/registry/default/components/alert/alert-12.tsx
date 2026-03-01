import { Alert, AlertDescription, AlertTitle } from '@timui/react'

export default function Component() {
  return (
    <Alert className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0 opacity-60" aria-hidden="true">
          !
        </span>
        <div className="grow space-y-1">
          <AlertTitle className="text-sm font-medium text-current">
            Password does not meet requirements:
          </AlertTitle>
          <ul className="list-inside list-disc text-sm opacity-80">
            <li>Minimum 8 characters</li>
            <li>Inlcude a special character</li>
          </ul>
        </div>
      </div>
    </Alert>
  )
}
