/** Demo folder for each core component. Aliases point at an existing docs group. */
const demoFolder: Record<string, string> = {
  'checkbox-tree': 'checkbox-tree',
  'radio-group': 'radio',
  'select-native': 'select',
  combobox: 'combobox',
  multiselect: 'multiselect',
  'tags-input': 'tags-input',
  calendar: 'calendar-date-picker',
  'date-picker': 'calendar-date-picker',
  resizable: 'resizable',
  datefield: 'calendar-date-picker',
  'dropdown-menu': 'dropdown',
  'image-cropper': 'image-cropper',
  'calendar-rac': 'calendar-date-picker',
  'datefield-rac': 'calendar-date-picker',
  cropper: 'image-cropper',
  sonner: 'toast',
}

export const componentDocsPath = (name: string) => demoFolder[name] || name
