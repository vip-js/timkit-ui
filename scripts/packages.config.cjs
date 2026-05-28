module.exports = {
  shared: {
    tokens: '@timui/tokens',
  },
  packages: [
    { name: 'agent', filter: '@timui/agent' },
    { name: 'react', filter: '@timui/react' },
    { name: 'vue', filter: '@timui/vue' },
    { name: 'html', filter: '@timui/html' },
    { name: 'weapp', filter: '@timui/weapp' },
  ],
}
