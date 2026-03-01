import { Alert, AlertDescription, AlertTitle } from '@timui/react'

export default function Component() {
  return (
    <Alert className="rounded-md border px-4 py-3">
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0 text-red-500 opacity-60" aria-hidden="true">
          !
        </span>
        <div className="grow space-y-1">
          <AlertTitle className="text-sm font-medium text-current">
            Password does not meet requirements:
          </AlertTitle>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            <li>Minimum 8 characters</li>
            <li>Inlcude a special character</li>
          </ul>
        </div>
      </div>
    </Alert>
  )
}
