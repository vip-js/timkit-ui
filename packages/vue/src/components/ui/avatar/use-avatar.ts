import { avatarConnect, avatarMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

export type UseAvatarProps = {
  id?: string
}

export function useAvatar(props: UseAvatarProps = {}) {
  const service = useMachine(avatarMachine, {
    id: props.id,
  })

  return computed(() => avatarConnect(service, normalizeProps))
}
