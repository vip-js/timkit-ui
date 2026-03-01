import { sheetContentVariants, sheetOverlayVariants, sheetCloseVariants, sheetTitleVariants, sheetDescriptionVariants } from '@timui/core'
import { setupSheetMachine } from './use-sheet'
import { resolveClasses } from '../utils'

type MachineEvent = string | {
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
  setContext: (context: {
    open?: boolean
  }) => void
}

type OpenChangeDetails = {
  open: boolean
}

type WeappSheetInternal = WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  data: {
    api: WeappSheetApi
  }
  properties: {
    open: boolean
    side: string
    id: string
    extClass: string
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

  properties: {
    open: { type: Boolean, value: false },
    side: { type: String, value: 'bottom' }, // 'top' | 'bottom' | 'left' | 'right'
    id: { type: String, value: 'sheet' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappSheetApi,
    contentClass: '',
    backdropClass: '',
    titleClass: '',
    descriptionClass: '',
    closeClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappSheetInternal
      const { service, cleanup, send } = setupSheetMachine(this, {
        id: this.properties.id || 'sheet',
        open: this.properties.open,
        onOpenChange: (details: OpenChangeDetails) => {
          this.triggerEvent('change', details)
          if (!details.open) {
            this.triggerEvent('close')
          }
        }
      })
      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: MachineEvent) => void
    },
    detached() {
      const self = this as WeappSheetInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappSheetInternal
      if (!state || !self._send) return

      const { connect } = setupSheetMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappSheetApi

      const side = toSheetSide(this.properties.side)
      const contentClass = resolveClasses(sheetContentVariants({ side }), self.properties.extClass)
      const backdropClass = resolveClasses(sheetOverlayVariants())

      const titleClass = resolveClasses(sheetTitleVariants())
      const descriptionClass = resolveClasses(sheetDescriptionVariants())
      const closeClass = resolveClasses(sheetCloseVariants())

      this.setData({
        api,
        contentClass,
        backdropClass,
        titleClass,
        descriptionClass,
        closeClass
      })
    },
    'open': function (val) {
      const self = this as WeappSheetInternal
      if (self._service && val !== self.data.api.open) {
        self._send?.(val ? 'OPEN' : 'CLOSE')
      }
    },
  },

  methods: {
    onBackdropTap() {
      const self = this as WeappSheetInternal
      self.data.api.backdropProps?.onClick?.()
    },
    onCloseTap() {
      const self = this as WeappSheetInternal
      self.data.api.closeTriggerProps?.onClick?.()
    },
    noop() { },
  }
})
