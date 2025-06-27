import { RiNotification3Line, RiSettings4Line } from '@remixicon/react'

export default function ProfileTab() {
  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 overflow-hidden rounded-full">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20middle%20aged%20Asian%20woman%2C%20warm%20smile%2C%20clean%20background&width=200&height=200&seq=32&orientation=squarish"
            className="h-full w-full object-cover"
            alt="Profile"
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Emma's Parent</h1>
          <p className="text-sm text-gray-600">Member since 2025</p>
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <RiSettings4Line className="text-gray-400" size={20} />
            <span className="text-gray-700">Settings</span>
          </div>
          <div className="flex items-center space-x-3">
            <RiNotification3Line className="text-gray-400" size={20} />
            <span className="text-gray-700">Notifications</span>
          </div>
        </div>
      </div>
    </div>
  )
}
