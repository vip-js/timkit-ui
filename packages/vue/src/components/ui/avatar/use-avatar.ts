import { avatarConnect, avatarMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

export type UseAvatarProps = {
  id?: string
}

export function useAvatar(props: UseAvatarProps = {}) {
  const generatedId = useId()

  const service = useMachine(avatarMachine, {
    id: props.id ?? generatedId,
  })
  const phase = ref('loading')
  watchEffect(() => {
    phase.value = service.state.matches('loaded') ? 'loaded' : service.state.matches('error') ? 'error' : 'loading'
  })

  return computed(() => {
    phase.value
    return { ...avatarConnect(service, normalizeProps), status: phase.value }
  })
}
