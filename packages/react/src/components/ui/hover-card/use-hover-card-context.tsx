import * as React from 'react'
import type { useHoverCard } from './use-hover-card'

export type UseHoverCardReturn = ReturnType<typeof useHoverCard>

const HoverCardContext = React.createContext<UseHoverCardReturn | null>(null)

export function HoverCardProvider({ children, value }: { children: React.ReactNode; value: UseHoverCardReturn }) {
    return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>
}

export function useHoverCardContext() {
    const context = React.useContext(HoverCardContext)
    if (!context) {
        throw new Error('useHoverCardContext must be used within a HoverCardProvider')
    }
    return context
}
