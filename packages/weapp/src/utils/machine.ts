/**
 * machine.ts — WeApp Zag.js 官方机器集成
 *
 * 此文件用于与 @zag-js/core 官方状态机（Machine）集成，适合具有复杂交互逻辑的组件，
 * 例如：switchMachine、accordionMachine 等。
 *
 * ⚠️ 与 machine-adapter.ts 的分工：
 * - machine.ts      → 使用 Zag 官方 Machine 实例的组件（需要完整状态机能力）
 * - machine-adapter.ts → 无复杂状态机需求的简单组件（Button、Badge 等），
 *                       模拟机器接口并适配小程序的 setData 更新模型
 */
import { createScope, Machine, StateMachine } from '@zag-js/core'

export interface MachineOptions<
  TC,
  TS extends StateMachine.StateSchema,
  TE extends StateMachine.EventObject,
> {
  context?: Partial<TC>
  state?: StateMachine.State<TC, TS, TE>
}

type MachineListener = (state: object) => void

type MachineService = {
  setContext: (context: object) => void
  subscribe: (listener: MachineListener) => () => void
  start: () => void
  stop: () => void
  send: (event: unknown) => void
  readonly state: object
  context?: { get: (key: string) => unknown; set: (key: string, value: unknown) => void }
  prop?: (key: string) => unknown
  scope?: object
  computed?: (key: string) => unknown
  refs?: object
}

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 16)) as typeof requestAnimationFrame
  globalThis.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as typeof cancelAnimationFrame
}

type ZagSchema = {
  props?: (params: { props: Record<string, unknown>; scope: object }) => Record<string, unknown>
  context?: (params: object) => Record<string, ZagBindable>
  computed?: Record<string, (params: object) => unknown>
  initialState?: (params: { prop: (key: string) => unknown }) => string
  states?: Record<string, ZagStateNode>
  on?: Record<string, ZagTransition | ZagTransition[]>
  entry?: unknown
  exit?: unknown
  effects?: unknown
  watch?: (params: object) => void
  refs?: (params: object) => Record<string, unknown>
  implementations?: {
    guards?: Record<string, (params: object) => boolean>
    actions?: Record<string, (params: object) => void>
    effects?: Record<string, (params: object) => void | VoidFunction>
  }
}

type ZagStateNode = {
  tags?: string[]
  entry?: unknown
  exit?: unknown
  effects?: unknown
  on?: Record<string, ZagTransition | ZagTransition[]>
}

type ZagTransition = {
  target?: string
  actions?: unknown
  guard?: string | ((params: object) => boolean)
  reenter?: boolean
}

type ZagBindable = {
  initial: unknown
  ref: { current: unknown }
  get: () => unknown
  set: (value: unknown) => void
  invoke: (next: unknown, prev: unknown) => void
  hash: (value: unknown) => string
}

const INIT_STATE = '__init__'

const passthrough = (props: object) => props

export const normalizeProps = new Proxy(
  { style: {} as Record<string, string> },
  {
    get(target, key) {
      if (key === 'style') return target.style
      return passthrough
    },
  }
)

function compactProps(props: object) {
  return Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined))
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function createBindable(read: () => {
  value?: unknown
  defaultValue?: unknown
  onChange?: (next: unknown, prev: unknown) => void
  isEqual?: (a: unknown, b: unknown) => boolean
}) {
  const first = read()
  let stored = first.value !== undefined ? first.value : first.defaultValue
  const initial = stored
  const ref = { current: stored }
  const equal = (a: unknown, b: unknown) => (read().isEqual ?? Object.is)(a, b)
  const api: ZagBindable = {
    initial,
    ref,
    get() {
      const next = read()
      return next.value !== undefined ? next.value : stored
    },
    set(value) {
      const prev = api.get()
      const next = typeof value === 'function' ? (value as (prev: unknown) => unknown)(prev) : value
      const live = read()
      if (live.value === undefined) {
        stored = next
        ref.current = next
      }
      if (!equal(next, prev)) live.onChange?.(next, prev)
    },
    invoke(next, prev) {
      stored = next
      ref.current = next
      read().onChange?.(next, prev)
    },
    hash(value) {
      return String(value)
    },
  }
  return api
}

function bindableFactory(read: () => {
  value?: unknown
  defaultValue?: unknown
  onChange?: (next: unknown, prev: unknown) => void
  isEqual?: (a: unknown, b: unknown) => boolean
}) {
  return createBindable(read)
}
bindableFactory.cleanup = () => undefined
bindableFactory.ref = (defaultValue: unknown) => {
  let value = defaultValue
  return {
    get: () => value,
    set: (next: unknown) => {
      value = next
    },
  }
}

function rootNode() {
  if (typeof document !== 'undefined') return document
  const node = {
    nodeType: 9,
    documentElement: { style: {} },
    body: { style: {} },
    activeElement: null,
    defaultView: undefined,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    ownerDocument: undefined as unknown,
  }
  node.ownerDocument = node
  return node
}

function isZagSchema(machine: unknown): machine is ZagSchema {
  if (!machine || typeof machine !== 'object') return false
  const schema = machine as ZagSchema
  return typeof schema.initialState === 'function' && !!schema.states
}

function runZagMachine(schema: ZagSchema, userProps: Record<string, unknown>) {
  const listeners = new Set<MachineListener>()
  const overlay: Record<string, unknown> = {}
  const scope = createScope({
    id: typeof userProps.id === 'string' ? userProps.id : undefined,
    ids: userProps.ids as Record<string, unknown> | undefined,
    getRootNode: () => (userProps.getRootNode as (() => object) | undefined)?.() ?? rootNode(),
  })
  const resolved = schema.props?.({ props: compactProps(userProps), scope }) ?? compactProps(userProps)
  const prop = (key: string) => (key in overlay ? overlay[key] : (resolved as Record<string, unknown>)[key])
  const cleanups = new Map<string, VoidFunction>()
  let transition: ZagTransition | undefined
  let event: Record<string, unknown> = { type: '' }
  let previousEvent: Record<string, unknown> | undefined
  let status = 'Not Started'
  let current = ''

  const getEvent = () => ({
    ...event,
    current: () => event,
    previous: () => previousEvent,
  })
  const stateApi = {
    get: () => current,
    set(next: string) {
      const prev = current
      current = next
      stateApi.invoke(next, prev)
    },
    invoke(next: string, prev: string) {
      current = next
      if (prev && prev !== INIT_STATE) {
        cleanups.get(prev)?.()
        cleanups.delete(prev)
        runActions(schema.states?.[prev]?.exit)
      }
      runActions(transition?.actions)
      const cleanup = runEffects(schema.states?.[next]?.effects)
      if (cleanup) cleanups.set(next, cleanup)
      if (prev === INIT_STATE) {
        runActions(schema.entry)
        const rootCleanup = runEffects(schema.effects)
        if (rootCleanup) cleanups.set(INIT_STATE, rootCleanup)
      }
      runActions(schema.states?.[next]?.entry)
    },
    matches: (...values: string[]) => values.includes(current),
    hasTag: (tag: string) => !!schema.states?.[current]?.tags?.includes(tag),
    initial: undefined as unknown,
    ref: { current: '' },
    hash: (value: unknown) => String(value),
  }

  const ctx = {
    get: (key: string) => contextMap[key]?.get(),
    set: (key: string, value: unknown) => contextMap[key]?.set(value),
    initial: (key: string) => contextMap[key]?.initial,
    hash: (key: string) => contextMap[key]?.hash(contextMap[key].get()),
  }
  const refs = {
    get: (key: string) => refMap[key],
    set: (key: string, value: unknown) => {
      refMap[key] = value
    },
  }
  const refMap: Record<string, unknown> = {}
  let contextMap: Record<string, ZagBindable> = {}

  function params() {
    return {
      state: stateApi,
      context: ctx,
      event: getEvent(),
      prop,
      send,
      action: runActions,
      guard: runGuard,
      track: () => undefined,
      refs,
      computed,
      flush: (fn: () => void) => fn(),
      scope,
      choose,
    }
  }
  function computed(key: string) {
    return schema.computed?.[key]?.({
      context: ctx,
      event: getEvent(),
      prop,
      refs,
      scope,
      computed,
    })
  }
  function runGuard(guard: ZagTransition['guard']) {
    if (!guard) return true
    if (typeof guard === 'function') return !!guard(params())
    return !!schema.implementations?.guards?.[guard]?.(params())
  }
  function runActions(actions: unknown) {
    const names = typeof actions === 'function' ? (actions as (params: object) => string[])(params()) : actions
    if (!names) return
    for (const name of names as string[]) {
      try {
        schema.implementations?.actions?.[name]?.(params())
      } catch {
        // Actions that measure DOM nodes do not run inside WeChat.
      }
    }
  }
  function runEffects(effects: unknown) {
    const names = typeof effects === 'function' ? (effects as (params: object) => string[])(params()) : effects
    if (!names) return
    const stops: VoidFunction[] = []
    for (const name of names as string[]) {
      try {
        const stop = schema.implementations?.effects?.[name]?.(params())
        if (typeof stop === 'function') stops.push(stop)
      } catch {
        // WeChat has no document. DOM effects stay on the web runtimes.
      }
    }
    return () => stops.forEach((stop) => stop())
  }
  function choose(transitions: ZagTransition | ZagTransition[] | undefined) {
    return toArray(transitions).find((item) => runGuard(item.guard))
  }

  contextMap =
    schema.context?.({
      prop,
      bindable: bindableFactory,
      scope,
      flush: (fn: () => void) => fn(),
      getContext: () => ctx,
      getComputed: () => computed,
      getRefs: () => refs,
      getEvent,
    }) ?? {}
  Object.assign(refMap, schema.refs?.({ prop, context: ctx }) ?? {})

  const queue: Array<Record<string, unknown>> = []
  let draining = false
  function send(next: unknown) {
    const normalized =
      typeof next === 'string' ? { type: next } : { ...(next as Record<string, unknown>) }
    if (typeof normalized.type !== 'string') return
    queue.push(normalized)
    if (draining) return
    draining = true
    while (queue.length) {
      const currentEvent = queue.shift()!
      if (status !== 'Started') continue
      previousEvent = event
      event = currentEvent
      const transitions =
        schema.states?.[current]?.on?.[String(currentEvent.type)] ?? schema.on?.[String(currentEvent.type)]
      const nextTransition = choose(transitions)
      if (!nextTransition) continue
      transition = nextTransition
      const target = nextTransition.target ?? current
      if (target !== current) stateApi.set(target)
      else if (nextTransition.reenter) stateApi.invoke(current, current)
      else runActions(nextTransition.actions ?? [])
    }
    draining = false
    notify()
  }

  function notify() {
    for (const listener of listeners) listener(service)
  }

  const service: MachineService = {
    setContext(next) {
      Object.assign(overlay, next)
      for (const [key, value] of Object.entries(next)) ctx.set(key, value)
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    start() {
      if (status === 'Started') return
      status = 'Started'
      current = schema.initialState?.({ prop }) ?? ''
      stateApi.initial = current
      stateApi.ref.current = current
      stateApi.invoke(current, INIT_STATE)
      schema.watch?.(params())
      notify()
    },
    stop() {
      status = 'Stopped'
      cleanups.forEach((stop) => stop())
      cleanups.clear()
      listeners.clear()
    },
    send,
    context: ctx,
    prop,
    scope,
    computed,
    refs,
    get state() {
      return stateApi
    },
  }
  return service
}

function stubService(props: object): MachineService {
  const listeners = new Set<MachineListener>()
  let context: object = { ...props }
  return {
    setContext(next) {
      context = { ...context, ...next }
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    start() {
      for (const listener of listeners) listener(this)
    },
    stop() {
      listeners.clear()
    },
    send() {},
    get state() {
      return { value: 'idle', context, matches: () => false, hasTag: () => false }
    },
  }
}

export function bindMachine(machine: unknown, props: object = {}) {
  if (typeof machine === 'function') return machine(props)
  if (isZagSchema(machine)) {
    try {
      return { machine: runZagMachine(machine, props as Record<string, unknown>) }
    } catch {
      return { machine: stubService(props) }
    }
  }

  return { machine: stubService(props) }
}

export function useMachine<
  TC extends Record<string, object>,
  TS extends StateMachine.StateSchema,
  TE extends StateMachine.EventObject,
>(
  component: WechatMiniprogram.Component.TrivialInstance,
  machine: Machine<TC, TS, TE>,
  options: MachineOptions<TC, TS, TE> = {}
) {
  const service = (machine as unknown as { machine: MachineService }).machine

  if (options.context) {
    service.setContext(options.context)
  }

  const start = () => {
    const unsubscribe = service.subscribe((state) => {
      component.setData({ state })
    })

    service.start()
    component.setData({ state: service })

    return () => {
      unsubscribe()
      service.stop()
    }
  }

  return {
    service,
    send: service.send,
    start,
    stop: () => service.stop(),
  }
}

export function publishMachine(component: {
  data?: { state?: object }
  setData: (data: { state?: object }) => void
}) {
  if (component.data?.state) component.setData({ state: component.data.state })
}

