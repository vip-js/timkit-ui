import { timelineVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    items: { type: Array, value: [] },
    orientation: { type: String, value: 'vertical' },
    value: { type: null, value: null },
    defaultValue: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
    current: 1 as number | null,
    rows: [],
    stepStatus: '',
    ariaLabel: '',
    labelledBy: '',
  },

  lifetimes: {
    attached() {
      this.data.current = this.readStep(this.properties.value)
      this.setData({
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
      this.sync()
    },
  },

  observers: {
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby'(next: string) {
      const labelledBy = String(next || '')
      if (labelledBy === this.data.labelledBy) return
      this.setData({ labelledBy })
    },
    'items, orientation, extClass': function () {
      this.sync()
    },
    value: function (value) {
      if (value == null) return
      const step = this.readStep(value)
      if (step === this.data.current) return
      this.data.current = step
      this.sync()
    },
  },

  methods: {
    readStep(value: unknown) {
      if (value === '') return null
      const source = value == null ? this.properties.defaultValue : value
      const step = Number(source)
      return Number.isFinite(step) ? step : 1
    },
    sync() {
      const current = this.data.current
      const rows = (this.properties.items || []).map((item, index) => {
        const step = Number(item?.step ?? index + 1)
        const state =
          current == null ? 'inactive' : step === current ? 'active' : step < current ? 'completed' : 'inactive'
        return { ...item, step, state }
      })
      const { baseClass } = timelineVariants({
        className: this.properties.extClass,
      })
      const index = rows.findIndex((row) => row.state === 'active')
      this.setData({
        className: baseClass,
        rows,
        stepStatus: index < 0 ? '' : `Step ${index + 1} of ${rows.length}`,
      })
    },
    onItemKey(event) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') {
        this.onItemTap(event)
        return
      }
      if (this.properties.disabled) return
      const items = this.properties.items || []
      const index = Number(event?.currentTarget?.dataset?.index)
      const enabled = items
        .map((item, itemIndex) => ({ item, itemIndex }))
        .filter(({ item }) => item && !item.disabled)
      const place = enabled.findIndex(({ itemIndex }) => itemIndex === index)
      if (place < 0) return
      const horizontal = this.properties.orientation === 'horizontal'
      let next = place
      if (key === 'Home') next = 0
      else if (key === 'End') next = enabled.length - 1
      else {
        const delta = horizontal
          ? key === 'ArrowRight'
            ? 1
            : key === 'ArrowLeft'
              ? -1
              : 0
          : key === 'ArrowDown'
            ? 1
            : key === 'ArrowUp'
              ? -1
              : 0
        if (!delta) return
        next = place + delta
        if (next < 0 || next >= enabled.length) return
      }
      if (next === place) return
      this.onItemTap({ currentTarget: { dataset: { index: enabled[next]?.itemIndex } } })
    },
    onItemTap(event) {
      if (this.properties.disabled) return
      const index = Number(event?.currentTarget?.dataset?.index)
      const item = this.properties.items?.[index]
      if (!item || item.disabled) return
      const step = Number(item.step ?? index + 1)
      if (this.properties.value == null) {
        this.data.current = step
        this.sync()
      }
      this.triggerEvent('change', { value: step })
    },
  },
})
