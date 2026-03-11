import { defineUCS } from '../../shared'

const datePickerSchema = defineUCS({
  name: 'date-picker',
  title: 'Date Picker',
  description: 'A component used to select a single date or a date range.',
  parts: [
    { name: 'root', description: 'The date picker container', isRoot: true },
    { name: 'trigger', description: 'The toggle button' },
    { name: 'content', description: 'The calendar popover content' },
  ],
  logic: {
    provider: 'zag',
    machine: 'date-picker',
  },
  props: [
    {
      name: 'mode',
      type: 'enum',
      description: 'The selection mode.',
      values: ['single', 'range'],
      defaultValue: 'single',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'The button placeholder.',
    },
    {
      name: 'numberOfMonths',
      type: 'number',
      description: 'The number of months to display.',
      defaultValue: 1,
    },
  ],
  slots: [],
  supportedPlatforms: ['web'],
})

export default datePickerSchema
