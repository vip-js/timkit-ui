/** Open / select / disable state shared by React, Vue, and WeApp bindings. */
export type ControlState = {
  open: boolean
  selected: string
  disabled: boolean
}

export type ControlAction = 'open' | 'close' | 'select' | 'disable' | 'enable'

export const createControl = (selected = ''): ControlState => ({
  open: false,
  selected,
  disabled: false,
})

export const reduceControl = (
  state: ControlState,
  action: ControlAction,
  value?: string
): ControlState => {
  if (state.disabled && action !== 'enable') return state
  if (action === 'open') return { ...state, open: true }
  if (action === 'close') return { ...state, open: false }
  if (action === 'select') return { ...state, selected: value ?? state.selected }
  if (action === 'disable') return { ...state, disabled: true }
  return { ...state, disabled: false }
}
