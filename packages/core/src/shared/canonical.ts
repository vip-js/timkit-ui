/** Names that share one schema. Compatibility aliases stay callable. */
const contractAliases: Record<string, string> = {
  'calendar-rac': 'calendar',
  'date-field': 'datefield',
  'datefield-rac': 'datefield',
  sonner: 'toast',
  cropper: 'image-cropper',
  'multiple-selector': 'multiselect',
}

export const dateContractNames = ['calendar', 'datefield', 'date-picker'] as const

export const canonicalContract = (name: string) => contractAliases[name] || name
