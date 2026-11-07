// @ts-nocheck
import {
  connectAvatarMachine,
  setupAvatarMachine,
  type WeappAvatarApi,
  type WeappAvatarService,
} from './use-avatar'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type AvatarStatus = 'idle' | 'loading' | 'loaded' | 'error'

type AvatarStatusDetails = {
  status: AvatarStatus
}

type WeappAvatarInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _service?: WeappAvatarService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  data: {
    api: WeappAvatarApi
    imageLoaded: boolean
  }
  properties: {
    src: string
    alt: string
    fallback: string
    size: string
    shape: string
    id: string
    extClass: string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    src: { type: String, value: '' },
    alt: { type: String, value: '' },
    fallback: { type: String, value: '' },
    size: { type: String, value: 'default' },
    shape: { type: String, value: 'circle' },
    id: { type: String, value: 'avatar' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappAvatarApi,
    className: '',
    imageLoaded: false,
    status: 'loading',
    imageStatus: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappAvatarInternal
      const controller = setupAvatarMachine(this, {
        id: this.properties.id,
        onStatusChange: (details: AvatarStatusDetails) => {
          if (details.status === 'loaded') {
            this.setData({ imageLoaded: true, imageStatus: '' })
          }
        },
      })

      self._service = controller.service as WeappAvatarService
      self._send = controller.send as (event: MachineEvent) => void
      self._cleanup = controller.start()
      this.sync()
    },
    detached() {
      const self = this as WeappAvatarInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappAvatarInternal
      if (!state || !self._send) return
      try {
        const api = connectAvatarMachine(state, self._send) as WeappAvatarApi
        this.setData({ api, className: this.properties.extClass })
      } catch {
        // The visible status comes from the image events.
      }
    },
    src: function () {
      this.sync()
    },
  },

  methods: {
    sync() {
      const status = this.properties.src ? 'loading' : 'error'
      this.setData({
        status,
        imageLoaded: false,
        imageStatus: status === 'error' ? 'Unavailable' : '',
        className: this.properties.extClass,
      })
    },
    onImageLoad() {
      this.setData({ imageLoaded: true, status: 'loaded', imageStatus: '' })
    },
    onImageError() {
      this.setData({ imageLoaded: false, status: 'error', imageStatus: 'Unavailable' })
    },
  },
})
