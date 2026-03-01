import { defineUCS } from '../../shared'

const avatarSchema = defineUCS({
    name: 'avatar',
    title: 'Avatar',
    description: 'An image element with a fallback for representing the user.',
    parts: [
        { name: 'root', description: 'The avatar container', isRoot: true },
        { name: 'image', description: 'The avatar image' },
        { name: 'fallback', description: 'The fallback element' },
    ],
    logic: {
        provider: 'zag',
        machine: 'avatar',
    },
    props: [
        {
            name: 'src',
            type: 'string',
            description: 'The source URL of the avatar image.',
        },
        {
            name: 'alt',
            type: 'string',
            description: 'The alt text for the avatar image.',
        },
    ],
    slots: [],
    supportedPlatforms: ['web', 'wechat'],
})

export default avatarSchema
