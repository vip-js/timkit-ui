// @ts-nocheck
import { emitTimEvent } from '../utils'
import {
  connectPaginationMachine,
  setupPaginationMachine,
  type WeappPaginationApi,
  type WeappPaginationService,
} from './use-pagination'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type PageTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      page?: number
    }
  }
}

type WeappPaginationInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _service?: WeappPaginationService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  data: {
    api: WeappPaginationApi
  }
  properties: {
    page: number
    pageSize: number
    total: number
    siblingCount: number
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
    page: { type: Number, value: 1 },
    pageSize: { type: Number, value: 10 },
    total: { type: Number, value: 0 },
    siblingCount: { type: Number, value: 1 },
    id: { type: String, value: 'pagination' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappPaginationApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappPaginationInternal
      const controller = setupPaginationMachine(this, {
        id: this.properties.id,
        page: this.properties.page,
        pageSize: this.properties.pageSize,
        count: this.properties.total,
        siblingCount: this.properties.siblingCount,
        onPageChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'pagination', {
            page: details.page,
            pageSize: details.pageSize,
          })
        },
      })

      self._service = controller.service as WeappPaginationService
      self._cleanup = controller.start()
      self._send = controller.send as (event: MachineEvent) => void
    },
    detached() {
      const self = this as WeappPaginationInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappPaginationInternal
      if (!state || !self._send) return
      const api = connectPaginationMachine(state, self._send) as WeappPaginationApi
      this.setData({ api, className: this.properties.extClass })
    },
  },

  methods: {
    onPrevTap() {
      const self = this as WeappPaginationInternal
      self.data.api.goToPrevPage?.()
    },
    onNextTap() {
      const self = this as WeappPaginationInternal
      self.data.api.goToNextPage?.()
    },
    onPageTap(e: PageTapEvent) {
      const self = this as WeappPaginationInternal
      const page = e.currentTarget.dataset.page
      if (typeof page === 'number') {
        self.data.api.goToPage?.(page)
      }
    },
  },
})
