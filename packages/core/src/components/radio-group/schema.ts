import { defineUCS } from '../../shared'

const radioGroupSchema = defineUCS({
    name: 'radio-group',
    title: 'Radio Group',
    description: 'A set of checkable buttons—known as radio buttons—where no more than one button can be checked at a time.',
    parts: [
        { name: 'root', description: 'The radio group container', isRoot: true },
        { name: 'item', description: 'The radio item' },
        { name: 'indicator', description: 'The visual indicator of the checked state' },
    ],
    logic: {
        provider: 'zag',
        machine: 'radioGroup',
    },
    props: [
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
        {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the radio group is disabled.',
            defaultValue: false,
        },
        {
            name: 'name',
            type: 'string',
            description: 'The name of the radio group.',
        }
    ],
    slots: [
        { name: 'default', description: 'The radio items' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default radioGroupSchema
