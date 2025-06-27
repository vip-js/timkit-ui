'use client'
import {
  RiHome5Fill,
  RiHome5Line,
  RiBookOpenLine,
  RiCalendarTodoLine,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react'

export const tabs = ['home', 'knowledge', 'plans', 'community', 'profile'] as const
export type Tab = typeof tabs[number]

export default function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
      <div className="grid h-16 grid-cols-5">
        {tabs.map((tab) => {
          const Icon =
            tab === 'home'
              ? activeTab === 'home'
                ? RiHome5Fill
                : RiHome5Line
              : tab === 'knowledge'
                ? RiBookOpenLine
                : tab === 'plans'
                  ? RiCalendarTodoLine
                  : tab === 'community'
                    ? RiTeamLine
                    : RiUserLine
          const label = tab.charAt(0).toUpperCase() + tab.slice(1)
          const active = activeTab === tab
          return (
            <button
              key={tab}
              className="flex flex-col items-center justify-center"
              onClick={() => onChange(tab)}
            >
              <Icon size={20} className={active ? 'text-primary' : 'text-gray-500'} />
              <span className={`mt-1 text-xs font-medium ${active ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
