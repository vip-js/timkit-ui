import { defineUCS } from '../../shared'

const inputSchema = defineUCS({
    name: 'input',
    title: 'Input',
    description: 'A basic text input component.',
    parts: [
        { name: 'root', description: 'The input element itself', isRoot: true },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'type',
            type: 'string',
            description: 'The type of input element.',
            defaultValue: 'text',
        },
        {
            name: 'placeholder',
            type: 'string',
            description: 'The placeholder text.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the input is disabled.',
            defaultValue: false,
        },
        {
            name: 'value',
            type: 'string',
            description: 'The controlled value.',
        },
        {
            name: 'onValueChange',
            type: 'event',
            description: 'Callback called when value changes.',
        },
    ],
    slots: [],
    supportedPlatforms: ['web', 'wechat'],
})

export default inputSchema
