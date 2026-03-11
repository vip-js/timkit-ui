import { avatarImageVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],
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
    src: { type: String, value: '' },
    alt: { type: String, value: '' },
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
        className: avatarImageVariants({ className: this.properties.extClass }),
      })
    },
    onLoad() {
      if (this.parent?.handleImageLoaded) {
        this.parent.handleImageLoaded()
      }
    },
    onError() {
      if (this.parent?.handleImageError) {
        this.parent.handleImageError()
      }
    },
  },
})
