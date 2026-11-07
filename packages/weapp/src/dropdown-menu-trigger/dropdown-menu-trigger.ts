import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    expanded: false,
  },
  observers: {
    extClass: function (extClass: string) {
      this.setData({
        className: resolveClasses('inline-flex items-center', extClass),
      })
    },
  },
  methods: {
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown') this.onTap()
    },
    onTap() {
      if (this.properties.disabled) return
      const parents = this.getRelationNodes('../dropdown-menu/dropdown-menu') as Array<{
        onTriggerTap?: () => void
        data?: { opened?: boolean }
      }>
      const parent = parents[0]
      parent?.onTriggerTap?.()
      this.setData({ expanded: parent?.data?.opened === true })
    },
    getRect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('#dropdown-menu-trigger')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
  },
})
