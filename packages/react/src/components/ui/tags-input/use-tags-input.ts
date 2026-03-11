import * as React from 'react'
import {
  createTimEvent,
  tagsInputConnect,
  tagsInputMachine,
  type TagsInputProps as CoreTagsInputProps,
  type TagsInputApi,
  type TagsInputValueChangeDetails,
} from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export type UseTagsInputProps = CoreTagsInputProps & {
  onValueChangeDetails?: (details: TagsInputValueChangeDetails) => void
}

export function useTagsInput({
  onValueChange,
  onValueChangeDetails,
  ...props
}: UseTagsInputProps): TagsInputApi {
  const generatedId = React.useId()
  const tagsInputId = props.id ?? generatedId

  const service = useMachine(tagsInputMachine, {
    ...props,
    id: tagsInputId,
    onValueChange(details) {
      onValueChangeDetails?.(details)
      onValueChange?.(createTimEvent('change', tagsInputId, { value: details.value }))
    },
  })

  return React.useMemo(() => {
    return Array.isArray(service)
      ? (
          tagsInputConnect as never as (
            state: never,
            send: never,
            props: typeof normalizeProps
          ) => TagsInputApi
        )(service[0] as never, service[1] as never, normalizeProps)
      : tagsInputConnect(service as never, normalizeProps)
  }, [service])
}
