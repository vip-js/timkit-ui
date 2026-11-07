import { breadcrumbListVariants } from '../utils'

type BreadcrumbItem =
  | string
  | {
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
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    items: { type: Array, value: [] },
    separator: { type: String, value: '/' },
    disabled: { type: Boolean, value: false },
    'aria-label': { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
    crumbStatus: '',
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
      this.updateClassName()
    },
  },

  observers: {
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    extClass: function () {
      this.updateClassName()
    },
    items: function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's breadcrumbListVariants for consistent styling
      const baseClass = breadcrumbListVariants({
        className: this.properties.extClass,
      })

      this.setData({ className: baseClass, crumbStatus: this.crumbText() })
    },
    crumbText() {
      const items = (this.properties.items || []) as Array<BreadcrumbItem & { current?: boolean }>
      if (!items.length) return ''
      const marked = items.findIndex((item) => item != null && typeof item === 'object' && item.current === true)
      const index = marked >= 0 ? marked : items.length - 1
      return `Crumb ${index + 1} of ${items.length}`
    },

    onItemKey(e: BreadcrumbTapEvent & { detail?: { key?: string } }) {
      const key = String(e?.detail?.key || '')
      if (key === 'Enter') this.onItemTap(e)
    },
    onItemTap(e: BreadcrumbTapEvent) {
      const index = Number(e.currentTarget.dataset.index)
      const items = (this.properties.items || []) as Array<BreadcrumbItem & { disabled?: boolean; current?: boolean }>
      const item = items[index]
      if (!item || this.properties.disabled) return
      const current = index === items.length - 1 || item.current === true
      if (current || item.disabled === true) return
      this.triggerEvent('tap', { index, item })
    },
  },
})
