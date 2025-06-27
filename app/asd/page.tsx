'use client'
import { useEffect, useState } from 'react'
import type { Metadata } from 'next'
import { RiSearchLine, RiNotification3Line } from '@remixicon/react'

import HomeTab from '@/components/asd/HomeTab'
import KnowledgeTab from '@/components/asd/KnowledgeTab'
import PlansTab from '@/components/asd/PlansTab'
import CommunityTab from '@/components/asd/CommunityTab'
import ProfileTab from '@/components/asd/ProfileTab'
import TabBar, { Tab } from '@/components/asd/TabBar'

export const metadata: Metadata = {
  title: 'ASD Family Intervention',
}

export default function ASDPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const done = localStorage.getItem('basicInfoSubmitted')
    if (!done) setShowForm(true)
  }, [])

  return (
    <div className="min-h-screen bg-white pb-16 font-sans">
      {/* Header */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-pacifico text-xl text-primary">logo</div>
          <div className="flex items-center space-x-3">
            <button className="flex h-8 w-8 items-center justify-center">
              <RiSearchLine size={20} />
            </button>
            <button className="relative flex h-8 w-8 items-center justify-center">
              <RiNotification3Line size={20} />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </div>

      <main className="pb-6 pt-14">
        {activeTab === 'home' && <HomeTab showForm={showForm} />}
        {activeTab === 'knowledge' && <KnowledgeTab />}
        {activeTab === 'plans' && <PlansTab />}
        {activeTab === 'community' && <CommunityTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}
