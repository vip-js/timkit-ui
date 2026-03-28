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
      name: 'mode',
      type: 'enum',
      description: 'The selection mode.',
      values: ['single', 'range', 'multiple'],
      defaultValue: 'single',
    },
  ],
  slots: [],
  supportedPlatforms: ['web'],
})

export default calendarSchema
