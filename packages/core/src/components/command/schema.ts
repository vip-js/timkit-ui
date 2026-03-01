import { defineUCS } from '../../shared'

const commandSchema = defineUCS({
    name: 'command',
    title: 'Command',
    description: 'A menu to filter and select from a list of commands.',
    parts: [
        { name: 'root', description: 'The command container', isRoot: true },
        { name: 'input', description: 'The search input' },
        { name: 'list', description: 'The results list' },
        { name: 'empty', description: 'Shown when no results are found' },
        { name: 'group', description: 'A group of items' },
        { name: 'item', description: 'A command item' },
        { name: 'shortcut', description: 'A keyboard shortcut' },
        { name: 'separator', description: 'A separator line' },
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
            description: 'Event handler called when value changes.',
        },
        {
            name: 'placeholder',
            type: 'string',
            description: 'The input placeholder.',
        },
    ],
    slots: [
        { name: 'default', description: 'The command segments' },
    ],
    supportedPlatforms: ['web'],
})

export default commandSchema
