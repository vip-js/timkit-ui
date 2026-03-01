import { defineUCS } from '../../shared'

const buttonSchema = defineUCS({
    name: 'button',

    title: 'Button',
    description:
        'A control that triggers an action or event. Buttons support icon slots, loading states, and multiple visual variants shared across web与微信小程序。',
    parts: [
        { name: 'root', description: 'The button element itself', isRoot: true },
        { name: 'label', description: 'The text label inside the button' },
        { name: 'icon', description: 'Optional icon element' },
    ],
    logic: {
        provider: 'none', // Button is a basic primitive
    },
    props: [
        {
            name: 'label',
            type: 'string',
            description: 'Visible text label displayed inside the button body。',
        },
        {
            name: 'variant',
            type: 'enum',
            description: 'Semantic styling preset that maps to shared design tokens。',
            values: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            defaultValue: 'default',
        },
        {
            name: 'size',
            type: 'enum',
            description: 'Controls the padding and typography size。',
            values: ['default', 'sm', 'lg', 'icon'],
            defaultValue: 'default',
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
                    name: 'default',
                    description: 'Primary action using brand color。',
                    tokens: ['color.primary', 'color.onPrimary'],
                },
                {
                    name: 'destructive',
                    description: 'Dangerous action using alert palette。',
                    tokens: ['color.destructive', 'color.onDestructive'],
                },
                {
                    name: 'outline',
                    description: 'Border-only action on background surface。',
                    tokens: ['color.border', 'color.background'],
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
                    name: 'link',
                    description: 'Text link action with underline interaction。',
                    tokens: ['color.primary'],
                },
            ],
            defaultOption: 'default',
        },
        {
            name: 'size',
            prop: 'size',
            description: 'Available control sizes。',
            options: [
                {
                    name: 'default',
                    description: 'Default button, 36px height。',
                    tokens: ['radius.md', 'typography.md'],
                },
                {
                    name: 'sm',
                    description: 'Compact button, 32px height。',
                    tokens: ['radius.sm', 'typography.sm'],
                },
                {
                    name: 'lg',
                    description: 'Large call-to-action, 40px height。',
                    tokens: ['radius.lg', 'typography.lg'],
                },
                {
                    name: 'icon',
                    description: 'Square icon-only button.',
                    tokens: ['radius.md', 'typography.md'],
                },
            ],
            defaultOption: 'default',
        },
    ],
    tokens: [
        'color.primary',
        'color.secondary',
        'color.destructive',
        'color.border',
        'color.background',
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
})

export default buttonSchema
