type ComponentDataValue =
  | string
  | number
  | boolean
  | undefined
  | ComponentDataValue[]
  | { [key: string]: ComponentDataValue }

type ComponentPropType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor
  | ObjectConstructor
  | FunctionConstructor
  | null

type ComponentProp = {
  type: ComponentPropType
  value?: ComponentDataValue
}

type RectLike = {
  top?: number
  left?: number
  bottom?: number
  right?: number
  width?: number
  height?: number
}

type SelectorQueryRect = RectLike & { [key: string]: ComponentDataValue }

type SelectorQuery = {
  select: (selector: string) => SelectorQuery
  boundingClientRect: (callback: (rect: SelectorQueryRect) => void) => SelectorQuery
  exec: () => void
}

type ComponentInstance = {
  data: Record<string, ComponentDataValue>
  properties: Record<string, ComponentDataValue>
  setData: (data: Record<string, ComponentDataValue>) => void
  getRelationNodes: (path: string) => ComponentInstance[]
  triggerEvent: (name: string, detail?: ComponentDataValue) => void
  createSelectorQuery: () => SelectorQuery
  close?: () => void
  open?: () => void
  toggle?: () => void
  getRect?: () => Promise<RectLike | undefined>
  showForMeasure?: () => void
  updatePosition?: (top?: ComponentDataValue, left?: ComponentDataValue) => void
  hide?: () => void
  _syncChildren: () => void
  _syncClassName: () => void
}

type ObserverHandler = (this: ComponentInstance, ...args: ComponentDataValue[]) => void
type MethodHandler = (this: ComponentInstance, ...args: ComponentDataValue[]) => void

type ComponentOptions = {
  properties?: Record<string, ComponentProp>
  data?: Record<string, ComponentDataValue>
  methods?: Record<string, MethodHandler>
  observers?: Record<string, ObserverHandler>
  lifetimes?: Record<string, (this: ComponentInstance) => void>
  relations?: Record<string, ComponentRelation>
  externalClasses?: string[]
}

type ComponentRelation = {
  type: 'parent' | 'child' | 'ancestor' | 'descendant'
  linked?: (this: ComponentInstance, target: ComponentInstance) => void
  linkChanged?: (this: ComponentInstance, target: ComponentInstance) => void
  unlinked?: (this: ComponentInstance, target: ComponentInstance) => void
}

declare function Component(options: ComponentOptions): void
