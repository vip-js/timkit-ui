import * as React from 'react'

export interface CreateContextOptions<T> {
  hookName?: string
  providerName?: string
  errorMessage?: string
  name?: string
  defaultValue?: T
}

export type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>]

export function createContext<ContextValue>(options: CreateContextOptions<ContextValue> = {}) {
  const {
    name,
    hookName = 'useContext',
    providerName = 'Provider',
    errorMessage,
    defaultValue,
  } = options

  const Context = React.createContext<ContextValue | undefined>(defaultValue)

  Context.displayName = name ?? providerName

  function useContext() {
    const context = React.useContext(Context)
    if (context === undefined) {
      const error = new Error(errorMessage ?? `${hookName} must be used within a ${providerName}`)
      error.name = 'ContextError'
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(error, useContext)
      }
      throw error
    }
    return context
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<ContextValue>
}
