import { avatarFallbackVariants } from '../utils'

Component({
  options: {
    styleIsolation: "apply-shared",
  },
  relations: {
    '../avatar/index': {
      type: 'parent',
      linked(target) {
        this.parent = target
      },
      unlinked() {
        this.parent = null
      },
    },
  },
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    hidden: false,
  },
  lifetimes: {
    attached() {
      this._syncClassName()
    },
  },
  observers: {
    extClass() {
      this._syncClassName()
    },
  },
  methods: {
    _syncClassName() {
      this.setData({
        className: avatarFallbackVariants({ className: this.properties.extClass }),
      })
    },
  },
})
