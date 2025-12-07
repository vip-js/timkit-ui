import type { ComponentSchema } from './index'

const buttonSchema: ComponentSchema = {
  name: 'button',
  title: 'Button',
  description:
    'A control that triggers an action or event. Buttons support icon slots, loading states, and multiple visual variants shared across web与微信小程序。',
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Visible text label displayed inside the button body。',
    },
    {
      name: 'variant',
      type: 'enum',
      description: 'Semantic styling preset that maps to shared design tokens。',
      values: ['primary', 'secondary', 'ghost', 'destructive'],
      defaultValue: 'primary',
    },
    {
      name: 'size',
      type: 'enum',
      description: 'Controls the padding and typography size。',
      values: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Marks the action as unavailable and prevents pointer / tap。',
      defaultValue: false,
    },
    {
      name: 'loading',
      type: 'boolean',
      description: 'Shows a busy indicator and disables interactions。',
      defaultValue: false,
    },
    {
      name: 'onPress',
      type: 'event',
      description: 'Callback that fires when the user clicks / taps the button。',
    },
  ],
  slots: [
    {
      name: 'icon-left',
      description: 'Optional leading icon rendered before the label。',
    },
    {
      name: 'default',
      description: 'The button label content，默认渲染 `label` prop。',
      required: true,
    },
    {
      name: 'icon-right',
      description: 'Optional trailing icon rendered after the label。',
    },
  ],
  variants: [
    {
      name: 'variant',
      prop: 'variant',
      description: 'Visual intent of the button。',
      options: [
        {
          name: 'primary',
          description: 'High emphasis action using brand color。',
          tokens: ['color.primary', 'color.onPrimary'],
        },
        {
          name: 'secondary',
          description: 'Low emphasis action with subtle background。',
          tokens: ['color.secondary', 'color.onSecondary'],
        },
        {
          name: 'ghost',
          description: 'Text style button with transparent background。',
          tokens: ['color.onSurface'],
        },
        {
          name: 'destructive',
          description: 'Dangerous action using alert palette。',
          tokens: ['color.destructive', 'color.onDestructive'],
        },
      ],
      defaultOption: 'primary',
    },
    {
      name: 'size',
      prop: 'size',
      description: 'Available control sizes。',
      options: [
        {
          name: 'sm',
          description: 'Compact button, 32px height。',
          tokens: ['radius.sm', 'typography.sm'],
        },
        {
          name: 'md',
          description: 'Default button, 40px height。',
          tokens: ['radius.md', 'typography.md'],
        },
        {
          name: 'lg',
          description: 'Large call-to-action, 48px height。',
          tokens: ['radius.lg', 'typography.lg'],
        },
      ],
      defaultOption: 'md',
    },
  ],
  tokens: [
    'color.primary',
    'color.secondary',
    'color.destructive',
    'color.onSurface',
    'radius.sm',
    'radius.md',
    'radius.lg',
    'typography.sm',
    'typography.md',
    'typography.lg',
  ],
  interactions: [
    {
      name: 'press',
      description: 'Button reacts to tap / click with hover + active states。',
      states: ['default', 'hover', 'active', 'disabled', 'loading'],
    },
  ],
  supportedPlatforms: ['web', 'wechat'],
}

export default buttonSchema
