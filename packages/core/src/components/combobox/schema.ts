import { defineUCS } from '../../shared'

const comboboxSchema = defineUCS({
    name: 'combobox',
    title: 'Combobox',
    description: 'A combination of an input and a listbox, allowing users to filter and select options.',
    parts: [
        { name: 'root', description: 'The combobox container', isRoot: true },
        { name: 'input', description: 'The search input' },
        { name: 'list', description: 'The results list' },
        { name: 'item', description: 'A single result item' },
        { name: 'empty', description: 'The empty state message' },
        { name: 'group', description: 'An item group' },
        { name: 'separator', description: 'A separator line' },
        { name: 'shortcut', description: 'A keyboard shortcut hint' },
    ],
    logic: {
        provider: 'zag',
        machine: 'combobox',
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
            description: 'Event handler called when the value changes.',
        },
        {
            name: 'placeholder',
            type: 'string',
            description: 'The search placeholder.',
        },
        {
            name: 'loop',
            type: 'boolean',
            description: 'Whether to loop through items.',
            defaultValue: true,
        }
    ],
    slots: [
        { name: 'default', description: 'The combobox segments' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default comboboxSchema
