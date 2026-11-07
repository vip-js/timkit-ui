/**
 * One recommended React entry per capability.
 * Compatibility files stay exported so existing installs keep compiling.
 */
export const preferredReactEntries = {
  button: 'button',
  input: 'input',
  checkbox: 'checkbox',
  dialog: 'dialog',
  dateField: 'date-field',
  datePicker: 'date-picker',
  calendar: 'calendar',
  toast: 'toast',
  multiselect: 'multiselect',
  cropper: 'cropper',
} as const

export const compatibilityAliases = {
  datefield: 'date-field',
  'datefield-rac': 'date-field',
  'calendar-rac': 'calendar',
  sonner: 'toast',
  'multiple-selector': 'multiselect',
  'image-cropper': 'cropper',
} as const
