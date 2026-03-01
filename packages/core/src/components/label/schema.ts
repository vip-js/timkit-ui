import { defineUCS } from '../../shared'

const labelSchema = defineUCS({
    name: 'label',
    title: 'Label',
    description: 'An accessible label component for form fields.',
    parts: [
        { name: 'root', description: 'The label element', isRoot: true },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'htmlFor',
            type: 'string',
            description: 'The id of the element the label is associated with.',
        }
    ],
    slots: [
        { name: 'default', description: 'The label text' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default labelSchema
