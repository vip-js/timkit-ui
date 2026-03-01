import { breadcrumbListVariants } from '../utils'

type BreadcrumbItem = string | {
  label?: string
  value?: string
  href?: string
}

type BreadcrumbTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      index?: number
    }
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    items: { type: Array, value: [] },
    separator: { type: String, value: '/' },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
  },

  lifetimes: {
    attached() {
      this.updateClassName()
    },
  },

  observers: {
    'extClass': function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's breadcrumbListVariants for consistent styling
      const baseClass = breadcrumbListVariants({
        className: this.properties.extClass
      })

      this.setData({ className: baseClass })
    },

    onItemTap(e: BreadcrumbTapEvent) {
      const index = e.currentTarget.dataset.index
      if (typeof index === 'number') {
        const items = this.properties.items as BreadcrumbItem[]
        const item = items[index]
        this.triggerEvent('tap', { index, item })
      }
    },
  },
})
