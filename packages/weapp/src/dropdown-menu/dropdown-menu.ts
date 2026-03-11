// @ts-nocheck
import { emitTimEvent } from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'
import {
  connectDropdownMenuMachine,
  setupDropdownMenuMachine,
  type WeappDropdownMenuApi,
  type WeappDropdownMenuService,
} from './use-dropdown-menu'

type MenuItemTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      value?: string
    }
  }
}

type WeappDropdownMenuInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _service?: WeappDropdownMenuService
  _cleanup?: () => void
  _send?: (event: object) => void
  data: {
    api: WeappDropdownMenuApi
  }
  properties: {
    open: boolean
    closeOnSelect: boolean
    id: string
    extClass: string
  }
}

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  properties: {
    open: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: true },
    ...createWeappBaseProps('dropdown-menu'),
  },

  data: {
    api: {} as WeappDropdownMenuApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappDropdownMenuInternal
      const { service, cleanup, send } = setupDropdownMenuMachine(this, {
        id: this.properties.id,
        open: this.properties.open,
        closeOnSelect: this.properties.closeOnSelect,
        onOpenChange: (details) => {
          this.triggerEvent('change', details)
          emitTimEvent(
            this,
            'openchange',
            'dropdownMenu.openChange',
            this.properties.id || 'dropdown-menu',
            {
              open: details.open,
            }
          )
        },
        onSelect: (details) => {
          this.triggerEvent('select', details)
        },
      })

      self._service = service
      self._cleanup = cleanup
      self._send = send
    },
    detached() {
      const self = this as WeappDropdownMenuInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappDropdownMenuInternal
      if (!state || !self._send) return
      const api = connectDropdownMenuMachine(state, self._send)
      this.setData({ api, className: this.properties.extClass })
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappDropdownMenuInternal
      self.data.api.triggerProps?.onClick?.()
    },
    onItemTap(e: MenuItemTapEvent) {
      const self = this as WeappDropdownMenuInternal
      const value = e.currentTarget.dataset.value
      if (value && self.data.api.selectItem) {
        self.data.api.selectItem({ value })
      }
    },
    onBackdropTap() {
      const self = this as WeappDropdownMenuInternal
      self.data.api.setOpen?.(false)
    },
  },
})
