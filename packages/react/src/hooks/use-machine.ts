import { useCallback, useRef, useState } from 'react'

type PrimitiveValue = string | number | boolean | null | undefined
type MachineValue = PrimitiveValue | MachineValue[] | { [key: string]: MachineValue }
type MachineContext = { [key: string]: MachineValue }
type MachineEventObject = {
  type: string
  [key: string]: MachineValue
}
type MachineEvent = string | MachineEventObject

type MachineTransition =
  | string
  | {
      target?: string
      actions?: string | string[]
    }

type MachineDefinition = {
  context?: MachineContext | ((...args: MachineValue[]) => MachineContext) | MachineContext
  initial?: string
  initialState?: { value?: string } | ((...args: MachineValue[]) => string) | { value?: string }
  states?: {
    [state: string]: {
      on?: { [eventType: string]: MachineTransition }
    }
  }
  on?: { [eventType: string]: MachineTransition }
  options?: {
    actions?: {
      [actionName: string]: (context: MachineContext, event: MachineEventObject) => void
    }
  }
  config?: {
    actions?: {
      [actionName: string]: (context: MachineContext, event: MachineEventObject) => void
    }
  }
  actions?: {
    [actionName: string]: (context: MachineContext, event: MachineEventObject) => void
  }
}

type HookState = {
  value?: string | { value?: string }
  context: MachineContext
}

const resolveInitialContext = (
  context: MachineDefinition['context'],
  override?: MachineContext
): MachineContext => {
  const base = typeof context === 'function' ? {} : (context ?? {})
  return {
    ...(typeof base === 'object' && base !== null ? (base as MachineContext) : {}),
    ...(override ?? {}),
  }
}

const resolveInitialStateValue = (machine: MachineDefinition): string | undefined => {
  if (typeof machine.initialState === 'function') return machine.initial
  if (typeof machine.initialState === 'object' && machine.initialState !== null) {
    return machine.initial || (machine.initialState as { value?: string }).value
  }
  return machine.initial
}

const isTransitionObject = (
  transition: MachineTransition
): transition is Exclude<MachineTransition, string> => typeof transition !== 'string'

export function useMachine(machine: object, options: { context?: MachineContext } = {}) {
  const machineRef = machine as {
    context?: MachineDefinition['context']
    initial?: string
    initialState?: MachineDefinition['initialState']
    states?: MachineDefinition['states']
    on?: MachineDefinition['on']
    options?: MachineDefinition['options']
    config?: MachineDefinition['config']
    actions?: MachineDefinition['actions']
  }
  const initialContext = resolveInitialContext(machineRef.context, options.context)

  const [state, setState] = useState({
    value: resolveInitialStateValue(machineRef),
    context: initialContext,
  } satisfies HookState)

  const stateRef = useRef(state)

  const send = useCallback(
    (event: MachineEvent) => {
      const evt = typeof event === 'string' ? { type: event } : event
      const current = stateRef.current

      const currentStateKey = (() => {
        if (typeof current.value === 'string') return current.value
        if (typeof current.value === 'object' && current.value !== null) {
          const valueObj = current.value as { value?: string }
          return valueObj.value || 'idle'
        }
        return 'idle'
      })()

      const transition =
        machineRef.states?.[currentStateKey]?.on?.[evt.type] || machineRef.on?.[evt.type]

      if (transition) {
        let nextStateKey = currentStateKey
        if (typeof transition === 'string') {
          nextStateKey = transition
        } else if (isTransitionObject(transition) && transition.target) {
          nextStateKey = transition.target
        }

        const actions = isTransitionObject(transition) ? transition.actions || [] : []
        const actionList = Array.isArray(actions) ? actions : [actions]
        const nextContext = { ...current.context }

        actionList.forEach((actionName: string) => {
          const actionFn =
            machineRef.options?.actions?.[actionName] ||
            machineRef.config?.actions?.[actionName] ||
            machineRef.actions?.[actionName]

          if (typeof actionFn === 'function') {
            actionFn(nextContext, evt)
          }
        })

        const nextState = {
          value: nextStateKey,
          context: nextContext,
        }

        stateRef.current = nextState
        setState(nextState satisfies HookState)
      }
    },
    [machineRef]
  )

  return [state, send] as const
}
