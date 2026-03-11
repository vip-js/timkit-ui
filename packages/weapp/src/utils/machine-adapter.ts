/**
 * machine-adapter.ts — WeApp 轻量机器适配器
 *
 * 此适配器用于 **不依赖 Zag 官方 Machine** 的简单组件（如 Button、Badge 等）。
 * 它模拟 Zag 机器的 context/state/send 接口，同时适配小程序的 setData 更新模型，
 * 使简单组件也可以使用声明式的状态机风格定义，而无需引入完整 Zag Machine 实例。
 *
 * ⚠️ 与 machine.ts 的分工：
 * - machine-adapter.ts → 简单组件（Button、Badge 等），无复杂状态迁移需求
 * - machine.ts         → 使用 Zag 官方 Machine 实例的组件（Switch、Accordion 等）
 */
import { createGuards } from '@zag-js/core'

type AnyRecord = Record<string, object>
type EventObject = { type: string; [key: string]: object }

type TransitionObject = {
  target?: string
  guard?: object
  actions?: object
}

type Transition = string | TransitionObject

type MachineLike = {
  props?: (args: { props: AnyRecord; scope: Scope }) => AnyRecord
  refs?: (args: { prop: (key: string) => object; context: ContextApi }) => AnyRecord
  computed?: Record<string, (args: AnyRecord) => object>
  context?: ((args: AnyRecord) => AnyRecord) | AnyRecord
  initialState?: ((args: { prop: (key: string) => object }) => string) | string
  initial?: string
  states?: Record<
    string,
    {
      tags?: string[]
      on?: Record<string, Transition | Transition[]>
    }
  >
  on?: Record<string, Transition | Transition[]>
  implementations?: {
    guards?: Record<string, (params: AnyRecord) => boolean>
    actions?: Record<string, (params: AnyRecord) => void>
  }
}

type ComponentInstance = {
  setData: (data: AnyRecord, cb?: () => void) => void
  __machineUpdating?: boolean
}

type AdapterOptions = {
  onUpdate?: (data: AnyRecord) => void
}

type Scope = {
  id: string
  getRootNode: () => null
  getDoc: () => null
  getWin: () => null
  getById: () => null
  getActiveElement: () => null
  isActiveElement: () => boolean
}

type ContextEntry = {
  initial?: object
  get?: () => object
  set?: (value: object) => void
  hash?: (value: object) => string
}

type ContextApi = {
  get: (key: string) => object
  set: (key: string, value: object) => void
  initial: (key: string) => object
  hash: (key: string) => string
}

const noopScope: Scope = {
  id: '',
  getRootNode: () => null,
  getDoc: () => null,
  getWin: () => null,
  getById: () => null,
  getActiveElement: () => null,
  isActiveElement: () => false,
}

export function createWeappMachine(
  machine: MachineLike,
  component: ComponentInstance,
  props: AnyRecord = {},
  options: AdapterOptions = {}
) {
  let rawProps = { ...props }
  let scope: Scope = { ...noopScope, id: String(rawProps.id || '') }

  const getResolvedProps = () =>
    typeof machine.props === 'function'
      ? machine.props({ props: { ...rawProps }, scope })
      : rawProps

  let resolvedProps = getResolvedProps()
  const prop = (key: string) => resolvedProps[key]

  const eventRef = { current: { type: '' } as EventObject, previous: null as EventObject | null }
  const getEvent = () => ({
    ...eventRef.current,
    current: () => eventRef.current,
    previous: () => eventRef.previous,
  })

  const bindable = (getParams: () => AnyRecord) => {
    const params = getParams()
    const initial = params.value ?? params.defaultValue
    let current = initial
    const ref = { current }
    return {
      initial,
      ref,
      get: () => current,
      set: (next: object) => {
        const prev = current
        current = typeof next === 'function' ? (next as (value: object) => object)(prev) : next
        ref.current = current
        if (typeof params.onChange === 'function' && current !== prev) {
          ;(params.onChange as (nextValue: object, prevValue: object) => void)(current, prev)
        }
      },
      hash: (value: object) =>
        typeof params.hash === 'function'
          ? (params.hash as (v: object) => string)(value)
          : String(value),
    }
  }

  let contextEntries: Record<string, object> = {}
  const ctx: ContextApi = {
    get: (key: string) => {
      const entry = contextEntries[key] as ContextEntry | undefined
      return entry?.get ? entry.get() : entry
    },
    set: (key: string, value: object) => {
      const entry = contextEntries[key] as ContextEntry | undefined
      if (entry?.set) entry.set(value)
      else contextEntries[key] = value
    },
    initial: (key: string) => (contextEntries[key] as ContextEntry | undefined)?.initial,
    hash: (key: string) => {
      const entry = contextEntries[key] as ContextEntry | undefined
      const current = entry?.get ? entry.get() : entry
      return entry?.hash ? entry.hash(current) : String(current)
    },
  }

  const refs = machine.refs?.({ prop, context: ctx }) ?? {}
  const computed = (key: string) =>
    machine.computed?.[key]?.({
      context: ctx,
      event: getEvent(),
      prop,
      scope,
      computed,
      refs,
    })

  contextEntries =
    typeof machine.context === 'function'
      ? machine.context({
          prop,
          bindable,
          scope,
          getContext: () => ctx,
          getComputed: () => computed,
          getRefs: () => refs,
          getEvent,
          flush: (fn: () => void) => fn(),
        })
      : machine.context || {}

  let currentState =
    typeof machine.initialState === 'function'
      ? machine.initialState({ prop })
      : machine.initialState || machine.initial || 'idle'

  const getState = () => ({
    value: currentState,
    matches: (...values: string[]) => values.includes(currentState),
    hasTag: (tag: string) => !!machine.states?.[currentState]?.tags?.includes(tag),
  })

  const { and, not, or } = createGuards()
  const guardImpl = {
    ...machine.implementations?.guards,
    and,
    or,
    not,
  }

  const getParams = (event: EventObject) => ({
    state: getState(),
    context: ctx,
    event,
    prop,
    send,
    action,
    guard,
    choose,
    refs,
    computed,
    scope,
    flush: (fn: () => void) => fn(),
  })

  function guard(guardOrFn: object, event: EventObject) {
    if (!guardOrFn) return true
    if (typeof guardOrFn === 'function') {
      return (guardOrFn as (params: AnyRecord) => boolean)(getParams(event))
    }
    const fn = guardImpl?.[String(guardOrFn)]
    return fn ? fn(getParams(event)) : false
  }

  function choose(transitions: object, event: EventObject) {
    if (!transitions) return null
    const list = Array.isArray(transitions) ? transitions : [transitions]
    return list.find((transition) => {
      if (!transition) return false
      if (typeof transition === 'string') return true
      const transitionObj = transition as TransitionObject
      if (!transitionObj.guard) return true
      return guard(transitionObj.guard, event)
    })
  }

  function action(actions: object, event: EventObject) {
    if (!actions) return
    const list = Array.isArray(actions) ? actions : [actions]
    list.forEach((actionName) => {
      if (!actionName) return
      if (typeof actionName === 'function') {
        ;(actionName as (params: AnyRecord) => void)(getParams(event))
        return
      }
      const fn = machine.implementations?.actions?.[String(actionName)]
      fn?.(getParams(event))
    })
  }

  function updateView() {
    const contextData: AnyRecord = {}
    Object.keys(contextEntries).forEach((key) => {
      const entry = contextEntries[key] as ContextEntry | undefined
      contextData[key] = entry?.get ? entry.get() : entry
    })

    const computedData: AnyRecord = {}
    if (machine.computed) {
      Object.keys(machine.computed).forEach((key) => {
        computedData[key] = computed(key)
      })
    }

    const payload = {
      state: currentState,
      ...contextData,
      ...computedData,
      ...resolvedProps,
    }

    component.__machineUpdating = true
    component.setData(payload, () => {
      component.__machineUpdating = false
      options.onUpdate?.(payload)
    })
  }

  function send(event: EventObject | string) {
    const evt = typeof event === 'string' ? { type: event } : event
    eventRef.previous = eventRef.current
    eventRef.current = evt

    const transitions = machine.states?.[currentState]?.on?.[evt.type] || machine.on?.[evt.type]
    const transition = choose(transitions, evt)
    if (!transition) return

    if (typeof transition === 'string') {
      currentState = transition
      updateView()
      return
    }

    if (transition.target) {
      currentState = transition.target
    }
    action(transition.actions, evt)
    updateView()
  }

  function setProps(next: AnyRecord) {
    rawProps = { ...rawProps, ...next }
    scope = { ...scope, id: String(rawProps.id || '') }
    resolvedProps = getResolvedProps()
    updateView()
  }

  updateView()

  return {
    send,
    setProps,
    get state() {
      return currentState
    },
    context: ctx,
  }
}
