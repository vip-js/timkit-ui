import * as React from 'react'
import { avatarConnect, avatarMachine, type AvatarApi } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

type UseAvatarProps = {
  id?: string
  dir?: 'ltr' | 'rtl'
  getRootNode?: (() => ShadowRoot | Document | Node) | undefined
}

export function useAvatar(
  props: UseAvatarProps = {}
): AvatarApi & { status: 'loading' | 'loaded' | 'error' } {
  const generatedId = React.useId()
  const service = useMachine(avatarMachine, {
    id: props.id ?? generatedId,
    dir: props.dir,
    getRootNode: props.getRootNode,
  })

  const api = avatarConnect(service, normalizeProps)
  const status = service.state.matches('error')
    ? 'error'
    : service.state.matches('loaded')
      ? 'loaded'
      : 'loading'
  return { ...api, status }
}
