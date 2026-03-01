import { Alert, AlertDescription } from '@timui/react'

export default function Component() {
  return (
    <Alert className="rounded-md border px-4 py-3">
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">
          !
        </span>
        <div className="flex grow justify-between gap-3">
          <AlertDescription className="text-sm text-current">
            Some information is missing!
          </AlertDescription>
          <a href="#" className="group text-sm font-medium whitespace-nowrap">
            Link
            <span
              className="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </a>
        </div>
      </div>
    </Alert>
  )
}
