import { useCallback, useEffect, useRef, useState } from 'react'

export function useMachine(machine: any, options: { context?: any } = {}) {
  // Initialize state from machine
  // We assume machine.initialState or machine.initial
  const initialContext = { ...machine.context, ...options.context }

  // Minimal state representation
  const [state, setState] = useState({
    value: machine.initial || machine.initialState?.value,
    context: initialContext,
  })

  const stateRef = useRef(state)

  // Sync prop updates to context if needed?
  // For now, we assume uncontrolled or standard flow.

  const send = useCallback(
    (event: any) => {
      const evt = typeof event === 'string' ? { type: event } : event
      const current = stateRef.current

      // Calculate next state
      // Zag/XState style: machine.transition(state, event)
      // But since we are using @zag-js/core createMachine, we used a simplified approach?
      // Wait, createMachine returns a structure. We need to interpret it manually if we don't use a library.
      // Reuse the logic from WeApp adapter?
      // "Resolution" logic.

      const currentStateKey =
        typeof current.value === 'string' ? current.value : current.value?.value || 'idle' // Handle object state

      const transitionConfig =
        machine.states?.[currentStateKey]?.on?.[evt.type] || machine.on?.[evt.type]

      const resolveTransition = (config: any) => {
        if (!config) return null
        if (Array.isArray(config)) {
          for (const option of config) {
            if (!option) continue
            if (!option.guard) return option
            const guardFn =
              machine.implementations?.guards?.[option.guard] ||
              machine.options?.guards?.[option.guard] ||
              machine.config?.guards?.[option.guard]
            if (typeof guardFn === 'function') {
              try {
                if (guardFn(current.context, evt)) return option
              } catch {
                continue
              }
            }
          }
          return null
        }
        return config
      }

      const transition = resolveTransition(transitionConfig)

      if (transition) {
        let nextStateKey = currentStateKey
        if (typeof transition === 'string') {
          nextStateKey = transition
        } else if (transition.target) {
          nextStateKey = transition.target
        }

        // Execute Actions (Mutable Context in this implementation)
        const actions = transition.actions || []
        const actionList = Array.isArray(actions) ? actions : [actions]
        const nextContext = { ...current.context } // Copy context

        actionList.forEach((actionName: string) => {
          // machine.options.actions is NOT where we put it in the last edit.
          // We merged actions into config.actions? NO. createMachine(config).
          // We put actions in config.options? No, config.actions.
          // machine definition has actions?
          // createMachine return value usually has .options or .config.
          const actionFn =
            machine.options?.actions?.[actionName] ||
            machine.config?.actions?.[actionName] ||
            machine.actions?.[actionName] // Logic might be here if merged

          if (typeof actionFn === 'function') {
            actionFn(nextContext, evt)
          }
        })

        if (typeof nextContext.open === 'boolean') {
          if (nextStateKey === 'open') nextContext.open = true
          if (nextStateKey === 'closed') nextContext.open = false
        }

        const nextState = {
          value: nextStateKey,
          context: nextContext,
        }

        stateRef.current = nextState
        setState(nextState)
      }
    },
    [machine]
  )

  return [state, send] as const
}
