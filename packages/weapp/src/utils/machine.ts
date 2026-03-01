import { Machine, StateMachine } from '@zag-js/core'

export interface MachineOptions<TC, TS extends StateMachine.StateSchema, TE extends StateMachine.EventObject> {
  context?: Partial<TC>
  state?: StateMachine.State<TC, TS, TE>
}

export function useMachine<
  TC extends Record<string, object>,
  TS extends StateMachine.StateSchema,
  TE extends StateMachine.EventObject
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
    stop: () => service.stop()
  }
}

export function normalizeProps(props: Record<string, object>) {
  return props
}
