import { defineUCS } from '../../shared'

const textareaSchema = defineUCS({
    name: 'textarea',
    title: 'Textarea',
    description: 'A multi-line text input component.',
    parts: [
        { name: 'root', description: 'The textarea element itself', isRoot: true },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'placeholder',
            type: 'string',
            description: 'The placeholder text.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the textarea is disabled.',
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

export default textareaSchema
