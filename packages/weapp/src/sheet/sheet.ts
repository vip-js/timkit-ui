import {
  createControl,
  sheetCloseVariants,
  sheetContentVariants,
  sheetDescriptionVariants,
  sheetOverlayVariants,
  sheetTitleVariants,
  reduceWidgetKey,
  type ControlState,
} from '@timui/core'

import { emitTimEvent, resolveClasses } from '../utils'
import { commitControl } from '../utils/control'
import { publishMachine } from '../utils/machine'
import { setupSheetMachine } from './use-sheet'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type SheetSide = 'top' | 'bottom' | 'left' | 'right'

type WeappSheetApi = {
  open?: boolean
  backdropProps?: {
    onClick?: () => void
  }
  closeTriggerProps?: {
    onClick?: () => void
  }
}

type WeappService = {
  setContext: (context: { open?: boolean }) => void
}

type OpenChangeDetails = {
  open: boolean
}

type WeappSheetInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    _connect?: (state: object, send: (event: MachineEvent) => void) => WeappSheetApi
    data: {
      api: WeappSheetApi
      control?: ControlState
    }
    properties: {
      open: boolean
      side: string
      id: string
      extClass: string
      disabled: boolean
    }
  }

function toSheetSide(value: string): SheetSide {
  if (value === 'top' || value === 'left' || value === 'right') return value
  return 'bottom'
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    side: { type: String, value: 'bottom' }, // 'top' | 'bottom' | 'left' | 'right'
    id: { type: String, value: 'sheet' },
    title: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappSheetApi,
    control: createControl() as ControlState,
    contentClass: '',
    backdropClass: '',
    titleClass: '',
    descriptionClass: '',
    closeClass: '',
    opened: false,
    openStatus: '',
    title: '',
    titleId: '',
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappSheetInternal
      const { service, start, send, connect } = setupSheetMachine(this, {
        id: this.properties.id || 'sheet',
        open: this.properties.open == null ? this.properties.defaultOpen === true : this.properties.open,
        onOpenChange: (details: OpenChangeDetails) => {
          this.triggerEvent('change', details)
          emitTimEvent(this, 'openchange', 'sheet.openChange', this.properties.id || 'sheet', {
            open: details.open,
          })
          if (details.open) this.triggerEvent('open')
          else this.triggerEvent('close')
        },
      })
      self._service = service as WeappService
      self._send = send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = start()
      const title = String(this.properties.title || '')
      this.setData({
        title,
        titleId: title ? `${this.properties.id || 'sheet'}-title` : '',
        ariaLabel: title ? '' : String(this.properties['aria-label'] || ''),
      })
      publishMachine(this)
    },
    detached() {
      const self = this as WeappSheetInternal
      self._cleanup?.()
    },
  },

  observers: {
    title: function (next: string) {
      const title = String(next || '')
      const titleId = title ? `${this.properties.id || 'sheet'}-title` : ''
      const ariaLabel = title ? '' : String(this.properties['aria-label'] || '')
      if (title === this.data.title && titleId === this.data.titleId && ariaLabel === this.data.ariaLabel) return
      this.setData({ title, titleId, ariaLabel })
    },
    'aria-label': function (next: string) {
      if (this.data.title) return
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    state: function (state) {
      const self = this as WeappSheetInternal
      if (!state || !self._send || !self._connect) return

      const api = self._connect(state, self._send) as WeappSheetApi

      const side = toSheetSide(this.properties.side)
      const contentClass = resolveClasses(sheetContentVariants({ side }), self.properties.extClass)
      const backdropClass = resolveClasses(sheetOverlayVariants())

      const titleClass = resolveClasses(sheetTitleVariants())
      const descriptionClass = resolveClasses(sheetDescriptionVariants())
      const closeClass = resolveClasses(sheetCloseVariants())

      this.setData({
        api,
        opened: api.open === true,
        openStatus: api.open === true ? 'Opened' : '',
        contentClass,
        backdropClass,
        titleClass,
        descriptionClass,
        closeClass,
      })
    },
    open: function (val) {
      const self = this as WeappSheetInternal
      if (val == null) return
      if (self._service && val !== self.data.api.open) {
        self._send?.(val ? 'OPEN' : 'CLOSE')
      }
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappSheetInternal
      if (self.properties.disabled) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: true })
        return
      }
      const click = { defaultPrevented: false, stopPropagation() {}, preventDefault() {} }
      const api = self.data.api as WeappSheetApi & {
        getTriggerProps?: () => { onClick?: (event: typeof click) => void }
      }
      api.getTriggerProps?.().onClick?.(click)
    },
    onBackdropTap() {
      const self = this as WeappSheetInternal
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      const next = commitControl(self, 'close')
      if (next.open) return
      const click = { defaultPrevented: false, stopPropagation() {}, preventDefault() {} }
      const api = self.data.api as WeappSheetApi & {
        getBackdropProps?: () => { onClick?: (event: typeof click) => void }
      }
      api.getBackdropProps?.().onClick?.(click)
      api.backdropProps?.onClick?.(click)
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCloseTap() {
      const self = this as WeappSheetInternal
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      const next = commitControl(self, 'close')
      if (next.open) return
      const click = { defaultPrevented: false, stopPropagation() {}, preventDefault() {} }
      const api = self.data.api as WeappSheetApi & {
        getCloseTriggerProps?: () => { onClick?: (event: typeof click) => void }
      }
      api.getCloseTriggerProps?.().onClick?.(click)
      api.closeTriggerProps?.onClick?.(click)
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const next = reduceWidgetKey(
        'sheet',
        { open: this.data.opened === true, index: 0, count: 0, checked: false, value: 0, min: 0, max: 0, step: 1 },
        key
      )
      if (!next.handled || next.open) return
      this.onCloseTap()
    },
    noop() {},
  },
})
