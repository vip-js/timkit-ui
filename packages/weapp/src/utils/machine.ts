/**
 * machine.ts — WeApp Zag.js 官方机器集成
 *
 * 此文件用于与 @zag-js/core 官方状态机（Machine）集成，适合具有复杂交互逻辑的组件，
 * 例如：switchMachine、accordionMachine 等。
 *
 * ⚠️ 与 machine-adapter.ts 的分工：
 * - machine.ts      → 使用 Zag 官方 Machine 实例的组件（需要完整状态机能力）
 * - machine-adapter.ts → 无复杂状态机需求的简单组件（Button、Badge 等），
 *                       模拟机器接口并适配小程序的 setData 更新模型
 */
import { Machine, StateMachine } from '@zag-js/core'

export interface MachineOptions<
  TC,
  TS extends StateMachine.StateSchema,
  TE extends StateMachine.EventObject,
> {
  context?: Partial<TC>
  state?: StateMachine.State<TC, TS, TE>
}

export function useMachine<
  TC extends Record<string, object>,
  TS extends StateMachine.StateSchema,
  TE extends StateMachine.EventObject,
>(
  component: WechatMiniprogram.Component.TrivialInstance,
  machine: Machine<TC, TS, TE>,
  options: MachineOptions<TC, TS, TE> = {}
) {
  const service = machine.machine

  if (options.context) {
    service.setContext(options.context)
  }

  const start = () => {
    const unsubscribe = service.subscribe((state) => {
      component.setData({ state })
    })

    service.start()
    component.setData({ state: service.state })

    return () => {
      unsubscribe()
      service.stop()
    }
  }

  return {
    service,
    send: service.send,
    start,
    stop: () => service.stop(),
  }
}

export function normalizeProps(props: Record<string, object>) {
  return props
}
