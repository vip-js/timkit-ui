import * as React from 'react'
import type { AvatarApi } from '@timui/core'

export const AvatarContext: React.Context<AvatarApi | null> = React.createContext<AvatarApi | null>(null)

export function useAvatarContext(): AvatarApi {
    const context = React.useContext(AvatarContext)
    if (!context) {
        throw new Error('Avatar components must be used within an AvatarProvider')
    }
    return context
}

export function AvatarProvider({ children, value }: { children: React.ReactNode; value: AvatarApi }) {
    return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
}
