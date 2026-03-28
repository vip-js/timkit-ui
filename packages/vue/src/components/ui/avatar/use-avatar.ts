import { avatarConnect, avatarMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

export type UseAvatarProps = {
  id?: string
}

export function useAvatar(props: UseAvatarProps = {}) {
  const generatedId = useId()

  const service = useMachine(avatarMachine, {
    id: props.id ?? generatedId,
  })

  return computed(() => avatarConnect(service, normalizeProps))
}
