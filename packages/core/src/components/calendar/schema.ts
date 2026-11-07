import { defineUCS } from '../../shared'

const calendarSchema = defineUCS({
  name: 'calendar',
  title: 'Calendar',
  description: 'A date picker component that allows users to view and select dates.',
  parts: [{ name: 'root', description: 'The calendar container', isRoot: true }],
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
      name: 'disabled',
      type: 'boolean',
      description: 'When true, date changes are ignored.',
      defaultValue: false,
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'When true, dates can be focused but not changed.',
      defaultValue: false,
    },
    {
      name: 'mode',
      type: 'enum',
      description: 'The selection mode.',
      values: ['single', 'range', 'multiple'],
      defaultValue: 'single',
    },
  ],
  slots: [],
  supportedPlatforms: ['web', 'wechat'],
})

export default calendarSchema
