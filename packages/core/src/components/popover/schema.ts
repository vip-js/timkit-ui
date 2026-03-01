import { defineUCS } from '../../shared'

const popoverSchema = defineUCS({
    name: 'popover',
    title: 'Popover',
    description: 'Displays rich content in a portal, triggered by a button.',
    parts: [
        { name: 'root', description: 'The popover container', isRoot: true },
        { name: 'trigger', description: 'The toggle button' },
        { name: 'anchor', description: 'The anchoring element' },
        { name: 'content', description: 'The popover content' },
    ],
    logic: {
        provider: 'zag',
        machine: 'popover',
    },
    props: [
        {
            name: 'open',
            type: 'boolean',
            description: 'The controlled open state.',
        },
        {
            name: 'defaultOpen',
            type: 'boolean',
            description: 'The default open state.',
        },
        {
            name: 'onOpenChange',
            type: 'event',
            description: 'Event handler called when the open state changes.',
        },
        {
            name: 'modal',
            type: 'boolean',
            description: 'Whether the popover is modal.',
            defaultValue: false,
        },
    ],
    slots: [
        { name: 'default', description: 'The popover core components' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default popoverSchema
