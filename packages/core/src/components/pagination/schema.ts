import { defineUCS } from '../../shared'

const paginationSchema = defineUCS({
    name: 'pagination',
    title: 'Pagination',
    description: 'A component used to navigate through a series of pages.',
    parts: [
        { name: 'root', description: 'The pagination container', isRoot: true },
        { name: 'content', description: 'The parent of items' },
        { name: 'item', description: 'A single item wrapper' },
        { name: 'link', description: 'A link to a page' },
        { name: 'previous', description: 'The previous page button' },
        { name: 'next', description: 'The next page button' },
        { name: 'ellipsis', description: 'The ellipsis indicator' },
    ],
    logic: {
        provider: 'zag',
        machine: 'pagination',
    },
    props: [
        {
            name: 'page',
            type: 'number',
            description: 'The current active page in controlled mode.',
            defaultValue: 1,
        },
        {
            name: 'defaultPage',
            type: 'number',
            description: 'The initial page used in uncontrolled mode.',
            defaultValue: 1,
        },
        {
            name: 'count',
            type: 'number',
            description: 'Total number of items used to calculate page count.',
        },
        {
            name: 'pageSize',
            type: 'number',
            description: 'Number of items rendered per page.',
            defaultValue: 10,
        },
        {
            name: 'siblingCount',
            type: 'number',
            description: 'Number of sibling pages shown around the active page.',
            defaultValue: 1,
        },
        {
            name: 'onPageChange',
            type: 'event',
            description: 'Callback fired when the active page changes.',
        },
        {
            name: 'onPageSizeChange',
            type: 'event',
            description: 'Callback fired when page size changes.',
        },
    ],
    slots: [
        { name: 'default', description: 'The pagination segments' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default paginationSchema
