Component({
  externalClasses: ['ext-class'],
  properties: {
    variant: {
      type: String,
      value: 'default', // default | secondary | destructive | outline
    },
  },
  data: {
    variantClass: '',
  },
  observers: {
    variant: function (variant) {
      this.setData({
        variantClass: `tk-badge-${variant || 'default'}`,
      })
    },
  },
})
