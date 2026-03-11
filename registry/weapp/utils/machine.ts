export function useMachine(context: any, machine: any, options: any = {}) {
  const service = machine.machine(options)

  service.start()

  const unsubscribe = service.subscribe((state: any) => {
    // Determine if we need to update
    // We assume the component has an 'updateApi' method to re-compute API from state
    if (context.updateApi) {
      context.updateApi(state, service.send)
    } else if (context.setData) {
      // Fallback: just set state
      context.setData({ state })
    }
  })

  // Cleanup
  const originalDetached = context.detached
  context.detached = function () {
    unsubscribe()
    service.stop()
    if (originalDetached) originalDetached.call(context)
  }

  return service
}

export function normalizeProps(props: any) {
  // WeApp normalizeProps: mostly identity, but we might want to sanitize some keys
  // For now, identity is enough as we manually bind in WXML
  return props
}
