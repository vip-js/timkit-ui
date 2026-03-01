import { defineUCS } from '../../shared'

const selectSchema = defineUCS({
    name: 'select',
    title: 'Select',
    description: 'Displays a list of options for the user to pick from—triggered by a button.',
    parts: [
        { name: 'root', description: 'The select container', isRoot: true },
        { name: 'trigger', description: 'The toggle button' },
        { name: 'value', description: 'The display value' },
        { name: 'content', description: 'The dropdown content' },
        { name: 'item', description: 'A single option' },
        { name: 'group', description: 'A group of options' },
        { name: 'label', description: 'A group label' },
        { name: 'separator', description: 'A separator line' },
    ],
    logic: {
        provider: 'zag',
        machine: 'select',
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
            description: 'The placeholder text.',
        }
    ],
    slots: [
        { name: 'default', description: 'The select segments' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default selectSchema
