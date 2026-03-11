Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    scrollY: {
      type: Boolean,
      value: true,
    },
    scrollX: {
      type: Boolean,
      value: false,
    },
    height: {
      type: String,
      value: '320rpx',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  methods: {
    onScroll(e: WechatMiniprogram.ScrollViewScroll) {
      this.triggerEvent('scroll', e.detail)
    },
  },
})
