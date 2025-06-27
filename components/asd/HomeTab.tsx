import BasicInfoForm from './BasicInfoForm'
import { RiHandHeartLine } from '@remixicon/react'

export default function HomeTab({ showForm }: { showForm: boolean }) {
  return (
    <div className="space-y-6 px-4">
      {showForm && <BasicInfoForm />}
      <section>
        <h1 className="text-xl font-semibold text-gray-900">Hello, Emma's parent!</h1>
        <p className="mt-1 text-sm text-gray-600">Friday, June 27, 2025</p>
      </section>
      <section className="rounded-lg bg-primary/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Emma's Progress</h2>
          <span className="cursor-pointer text-xs font-medium text-primary">View Details</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded bg-white p-3 shadow-sm">
            <p className="mb-1 text-xs text-gray-500">Activities</p>
            <p className="text-lg font-semibold text-gray-900">12/15</p>
          </div>
          <div className="rounded bg-white p-3 shadow-sm">
            <p className="mb-1 text-xs text-gray-500">Courses</p>
            <p className="text-lg font-semibold text-gray-900">3/5</p>
          </div>
          <div className="rounded bg-white p-3 shadow-sm">
            <p className="mb-1 text-xs text-gray-500">Sessions</p>
            <p className="text-lg font-semibold text-gray-900">8</p>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Today's Plan</h2>
          <span className="cursor-pointer text-xs font-medium text-primary">View All</span>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <RiHandHeartLine size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Social Interaction</h3>
                <p className="text-xs text-gray-500">Age group: 4-6 years</p>
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">20 min</span>
          </div>
          <div className="mb-3">
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: '45%' }} />
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-xs text-gray-500">Progress: 45%</span>
              <span className="text-xs text-gray-500">2/5 activities</span>
            </div>
          </div>
          <button className="w-full rounded-button bg-primary py-2.5 text-sm font-medium text-white">
            Continue Activity
          </button>
        </div>
      </section>
    </div>
  )
}
