'use client'

import * as React from 'react'

export type Framework = 'react' | 'vue' | 'weapp' | 'html'

interface FrameworkContextType {
  framework: Framework
  setFramework: (framework: Framework) => void
}

const FrameworkContext = React.createContext<FrameworkContextType | undefined>(undefined)

export function FrameworkProvider({ children }: { children: React.ReactNode }) {
  const [framework, setFramework] = React.useState<Framework>('react')

  React.useEffect(() => {
    const saved = localStorage.getItem('timui-framework') as Framework
    if (saved && ['react', 'vue', 'weapp', 'html'].includes(saved)) {
      setFramework(saved)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      framework,
      setFramework: (fw: Framework) => {
        setFramework(fw)
        localStorage.setItem('timui-framework', fw)
      },
    }),
    [framework]
  )

  return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>
}

export function useFramework() {
  const context = React.useContext(FrameworkContext)
  if (context === undefined) {
    throw new Error('useFramework must be used within a FrameworkProvider')
  }
  return context
}
