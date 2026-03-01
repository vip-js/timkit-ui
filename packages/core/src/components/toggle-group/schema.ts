import { defineUCS } from '../../shared'

const toggleGroupSchema = defineUCS({
    name: 'toggle-group',
    title: 'Toggle Group',
    description: 'A set of two-state buttons that can be toggled on or off.',
    parts: [
        { name: 'root', description: 'The group container', isRoot: true },
        { name: 'item', description: 'A toggle item' },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'type',
            type: 'enum',
            description: 'Whether one or multiple items can be toggled.',
            values: ['single', 'multiple'],
            defaultValue: 'single',
        },
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
    ],
    slots: [
        { name: 'default', description: 'The toggle items' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default toggleGroupSchema
