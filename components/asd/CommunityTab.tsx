import { RiCalendarTodoLine } from '@remixicon/react'

export default function CommunityTab() {
  return (
    <div className="space-y-4 px-4">
      <h1 className="text-xl font-semibold text-gray-900">Community</h1>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20Asian%20woman%2C%20warm%20smile%2C%20clean%20background&width=100&height=100&seq=31&orientation=squarish"
            className="h-10 w-10 rounded-full object-cover"
            alt="Avatar"
          />
          <div className="flex-1">
            <h3 className="font-medium">Support Group Meeting</h3>
            <p className="mt-1 text-sm text-gray-600">
              Join us this Saturday for our weekly parent support group meeting.
            </p>
            <div className="mt-2 flex items-center">
              <RiCalendarTodoLine className="mr-1 text-gray-400" size={16} />
              <span className="text-xs text-gray-500">Online via Zoom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
