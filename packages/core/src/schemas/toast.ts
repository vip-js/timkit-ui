import type { ComponentSchema } from './index'

const toastSchema: ComponentSchema = {
  name: 'toast',
  title: 'Toast',
  description: 'A succinct message that is displayed temporarily.',
  props: [
    {
      name: 'variant',
      type: 'enum',
      description: 'The visual style of the toast.',
      values: ['default', 'destructive'],
      defaultValue: 'default',
    },
    {
      name: 'title',
      type: 'string',
      description: 'The title of the toast.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'The description of the toast.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Whether the toast is open.',
      defaultValue: true,
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the open state changes.',
    },
  ],
  slots: [
    {
      name: 'default',
      description: 'The content of the toast.',
    },
    {
      name: 'action',
      description: 'The action to perform.',
    },
    {
      name: 'close',
      description: 'The close button.',
    },
  ],
  variants: [
    {
      name: 'variant',
      prop: 'variant',
      description: 'Visual style of the toast.',
      options: [
        {
          name: 'default',
          description: 'Default toast style.',
        },
        {
          name: 'destructive',
          description: 'Destructive toast style.',
        },
      ],
      defaultOption: 'default',
    },
  ],
  supportedPlatforms: ['web', 'wechat'],
}

export default toastSchema
