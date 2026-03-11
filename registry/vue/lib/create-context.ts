import { inject, provide, type InjectionKey } from 'vue'

export interface CreateContextOptions<T> {
  id: string
  providerName?: string
  errorMessage?: string
  defaultValue?: T
}

export type CreateContextReturn<T> = readonly [
  (value: T) => void,
  (fallback?: T) => T,
  InjectionKey<T>,
]

export function createContext<T>(options: CreateContextOptions<T>): CreateContextReturn<T> {
  const { id, providerName, errorMessage, defaultValue } = options

  const ContextKey: InjectionKey<T> = Symbol(id)

  function Provider(value: T) {
    provide(ContextKey, value)
  }

  function useContext(fallback?: T): T {
    const context = inject(ContextKey, fallback ?? defaultValue)
    if (context === undefined) {
      const error = new Error(
        errorMessage ??
          `Injection \`${id}\` not found. Component must be used within \`${
            providerName ?? 'Provider'
          }\``
      )
      error.name = 'ContextError'
      Error.captureStackTrace?.(error, useContext)
      throw error
    }
    return context
  }

  return [Provider, useContext, ContextKey] as const
}
