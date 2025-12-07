import type { ComponentSchema } from './index'

const badgeSchema: ComponentSchema = {
  name: 'badge',
  title: 'Badge',
  description: 'Displays a badge or a component that looks like a badge.',
  props: [
    {
      name: 'variant',
      type: 'enum',
      description: 'The visual style of the badge.',
      values: ['default', 'secondary', 'destructive', 'outline'],
      defaultValue: 'default',
    },
  ],
  slots: [
    {
      name: 'default',
      description: 'The content of the badge.',
      required: true,
    },
  ],
  variants: [
    {
      name: 'variant',
      prop: 'variant',
      description: 'Visual style of the badge.',
      options: [
        {
          name: 'default',
          description: 'Default badge style.',
          tokens: ['color.primary', 'color.onPrimary'],
        },
        {
          name: 'secondary',
          description: 'Secondary badge style.',
          tokens: ['color.secondary', 'color.onSecondary'],
        },
        {
          name: 'destructive',
          description: 'Destructive badge style.',
          tokens: ['color.destructive', 'color.onDestructive'],
        },
        {
          name: 'outline',
          description: 'Outline badge style.',
          tokens: ['color.border', 'color.foreground'],
        },
      ],
      defaultOption: 'default',
    },
  ],
  supportedPlatforms: ['web', 'wechat'],
}

export default badgeSchema
