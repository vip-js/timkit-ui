import { defineUCS } from '../../shared'

const switchSchema = defineUCS({
    name: 'switch',
    title: 'Switch',
    description: 'A control that allows the user to toggle between on and off states.',
    parts: [
        { name: 'root', description: 'The switch container', isRoot: true },
        { name: 'thumb', description: 'The thumb element that slides' },
    ],
    logic: {
        provider: 'zag',
        machine: 'switch',
    },
    props: [
        {
            name: 'checked',
            type: 'boolean',
            description: 'The controlled checked state.',
        },
        {
            name: 'onCheckedChange',
            type: 'event',
            description: 'Callback called when checked state changes.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the switch is disabled.',
            defaultValue: false,
        },
    ],
    slots: [],
    supportedPlatforms: ['web', 'wechat'],
})

export default switchSchema
