type ToggleGroupParent = {
  onItemTap: (event: { currentTarget: { dataset: { value?: string; disabled?: boolean } } }) => void
  onItemKey?: (event: { value?: string; detail?: { key?: string } }) => void
  properties?: { disabled?: boolean }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  relations: {
    '../toggle-group/toggle-group': {
      type: 'ancestor',
    },
  },
  properties: {
    value: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },
  data: {
    pressed: false,
    tabbable: true,
    groupDisabled: false,
    itemRole: 'button',
    className: '',
  },
  observers: {
    extClass(extClass: string) {
      this.setData({ className: extClass || '' })
    },
  },
  methods: {
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        const parent = this.getRelationNodes('../toggle-group/toggle-group')[0] as ToggleGroupParent | undefined
        parent?.onItemKey?.({ value: this.properties.value, detail: { key } })
        return
      }
      if (key === 'Enter' || key === ' ') this.onTap()
    },
    onTap() {
      if (this.properties.disabled) return
      const parent = this.getRelationNodes('../toggle-group/toggle-group')[0] as ToggleGroupParent | undefined
      if (!parent || parent.properties?.disabled) return
      parent.onItemTap({
        currentTarget: { dataset: { value: this.properties.value, disabled: this.properties.disabled } },
      })
    },
  },
})
