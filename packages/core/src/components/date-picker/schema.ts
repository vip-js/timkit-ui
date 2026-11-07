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
      name: 'value',
      type: 'array',
      description: 'The controlled selected dates.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the selected dates change.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'The controlled open state of the calendar.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'The default open state of the calendar when uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the calendar open state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, opening and date changes are ignored.',
      defaultValue: false,
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'When true, the calendar can be opened and days can be focused, but selection does not change.',
      defaultValue: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'When true, the date picker is announced as required.',
      defaultValue: false,
    },
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
  supportedPlatforms: ['web', 'wechat'],
})

export default datePickerSchema
