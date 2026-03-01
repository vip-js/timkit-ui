import { defineUCS } from '../../shared'

const navbarSchema = defineUCS({
    name: 'navbar',
    title: 'Navbar',
    description: 'A responsive navigation header component.',
    parts: [
        { name: 'root', description: 'The navbar container', isRoot: true },
        { name: 'content', description: 'The inner wrapper' },
        { name: 'brand', description: 'The brand logo section' },
        { name: 'nav', description: 'The navigation links section' },
        { name: 'item', description: 'A single nav item' },
        { name: 'actions', description: 'The actions section (e.g., buttons)' },
    ],
    logic: {
        provider: 'none',
    },
    props: [],
    slots: [
        { name: 'default', description: 'The navbar segments' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default navbarSchema
