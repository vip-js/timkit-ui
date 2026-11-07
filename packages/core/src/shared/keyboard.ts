export const keyboardWidgets = [
  'dialog',
  'sheet',
  'select',
  'menu',
  'tabs',
  'accordion',
  'checkbox',
  'switch',
  'slider',
] as const

/** One primary key per widget. React and Vue tests dispatch this same key. */
export const widgetKeyContract: Record<(typeof keyboardWidgets)[number], string> = {
  dialog: 'Escape',
  sheet: 'Escape',
  select: 'ArrowDown',
  menu: 'ArrowDown',
  tabs: 'ArrowRight',
  accordion: 'ArrowDown',
  checkbox: ' ',
  switch: ' ',
  slider: 'ArrowRight',
}

export type KeyboardWidget = (typeof keyboardWidgets)[number]

export type WidgetState = {
  open: boolean
  index: number
  count: number
  checked: boolean
  value: number
  min: number
  max: number
  step: number
}

export type FocusTarget = {
  focus: () => void
  isConnected: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const moveIndex = (index: number, count: number, delta: number) => {
  if (count <= 0) return 0
  return (index + delta + count) % count
}

export const restoreFocus = (trigger: FocusTarget | null) => {
  if (!trigger || !trigger.isConnected) return false
  trigger.focus()
  return true
}

export const reduceWidgetKey = (
  widget: KeyboardWidget,
  state: WidgetState,
  key: string
): WidgetState & { handled: boolean } => {
  const next = { ...state, handled: false }
  if (widget === 'dialog' || widget === 'sheet') {
    if (key === 'Escape' && state.open) return { ...next, open: false, handled: true }
    if (key === 'Tab' && state.open && state.count > 0) {
      return { ...next, index: moveIndex(state.index, state.count, 1), handled: true }
    }
    if (key === 'Shift+Tab' && state.open && state.count > 0) {
      return { ...next, index: moveIndex(state.index, state.count, -1), handled: true }
    }
    return next
  }
  if (widget === 'select' || widget === 'menu') {
    if (key === 'Escape' && state.open) return { ...next, open: false, handled: true }
    if (!state.open && (key === 'ArrowDown' || key === 'Enter' || key === ' ')) {
      return { ...next, open: true, handled: true }
    }
    if (state.open && key === 'ArrowDown') {
      return { ...next, index: moveIndex(state.index, state.count, 1), handled: true }
    }
    if (state.open && key === 'ArrowUp') {
      return { ...next, index: moveIndex(state.index, state.count, -1), handled: true }
    }
    if (state.open && key === 'Enter') return { ...next, open: false, handled: true }
    return next
  }
  if (widget === 'tabs' || widget === 'accordion') {
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      return { ...next, index: moveIndex(state.index, state.count, 1), handled: true }
    }
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      return { ...next, index: moveIndex(state.index, state.count, -1), handled: true }
    }
    if (key === 'Home') return { ...next, index: 0, handled: true }
    if (key === 'End') return { ...next, index: Math.max(0, state.count - 1), handled: true }
    if (widget === 'accordion' && (key === 'Enter' || key === ' ')) {
      return { ...next, checked: !state.checked, handled: true }
    }
    return next
  }
  if (widget === 'checkbox' || widget === 'switch') {
    if (key === ' ') return { ...next, checked: !state.checked, handled: true }
    return next
  }
  if (key === 'ArrowRight' || key === 'ArrowUp') {
    return { ...next, value: clamp(state.value + state.step, state.min, state.max), handled: true }
  }
  if (key === 'ArrowLeft' || key === 'ArrowDown') {
    return { ...next, value: clamp(state.value - state.step, state.min, state.max), handled: true }
  }
  if (key === 'Home') return { ...next, value: state.min, handled: true }
  if (key === 'End') return { ...next, value: state.max, handled: true }
  return next
}
