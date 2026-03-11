import { cn, createTimEvent, type JsonValue } from '@timui/core'

export * from '@timui/core'
export { cn as resolveClasses } from '@timui/core'

type WeappEventEmitter = {
  triggerEvent: (name: string, detail?: Record<string, unknown>) => void
}

export function emitTimEvent<TDetail extends Record<string, JsonValue>>(
  instance: WeappEventEmitter,
  eventName: string,
  type: string,
  targetId: string,
  detail: TDetail
) {
  instance.triggerEvent(
    eventName,
    createTimEvent(type, targetId, detail) as unknown as Record<string, unknown>
  )
}
