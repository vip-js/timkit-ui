import { RiCalendarTodoLine } from '@remixicon/react'

export default function PlansTab() {
  return (
    <div className="space-y-4 px-4">
      <h1 className="text-xl font-semibold text-gray-900">Intervention Plans</h1>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Current Plan</h2>
          <span className="text-xs text-primary">Week 3/12</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-green-600"
              >
                <path d="M20.285 6.708l-11.4 11.4-5.657-5.657 1.414-1.414 4.243 4.242 9.986-9.986z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Morning Routine</h3>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                <div className="h-1.5 rounded-full bg-green-500" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <RiCalendarTodoLine className="text-primary" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Social Skills Training</h3>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
