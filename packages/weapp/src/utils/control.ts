import { createControl, reduceControl, type ControlAction, type ControlState } from '@timui/core'

type ControlHost = {
  data?: { control?: ControlState }
  properties?: { disabled?: boolean }
  setData: (data: { control: ControlState }) => void
}

export function commitControl(host: ControlHost, action: ControlAction, value?: string) {
  const current = {
    ...(host.data?.control ?? createControl()),
    disabled: !!host.properties?.disabled,
  }
  const next = reduceControl(current, action, value)
  host.setData({ control: next })
  return next
}

type ControlEvent = {
  mark?: { value?: string | number }
  detail?: { value?: string | number | boolean }
  currentTarget?: { dataset?: { value?: string | number } }
}

export function controlEventValue(event?: ControlEvent) {
  const value = event?.mark?.value ?? event?.currentTarget?.dataset?.value ?? event?.detail?.value
  return value === undefined || value === null ? '' : String(value)
}
