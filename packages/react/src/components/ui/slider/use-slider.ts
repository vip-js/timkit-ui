import * as React from 'react'
import type { SliderProps as CoreSliderProps } from '@timui/core'
import { createTimEvent, sliderConnect, sliderMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSliderProps extends Omit<CoreSliderProps, 'id'> {
  id?: string
}

export function useSlider(props: UseSliderProps) {
  const generatedId = React.useId()
  const sliderId = props.id ?? generatedId
  const {
    id: _id,
    onValueChange,
    onValueChangeEnd,
    showTooltip: _showTooltip,
    tooltipContent: _tooltipContent,
    min,
    max,
    step,
    value,
    defaultValue,
    ...machineProps
  } = props
  void _id
  void _showTooltip
  void _tooltipContent

  const controlled = value !== undefined
  const minValue = min ?? 0
  const maxValue = max ?? 100
  const clamp = (list: number[]) => list.map((item) => Math.min(maxValue, Math.max(minValue, item)))
  const incoming = controlled ? (value == null ? [] : value) : undefined
  const machineValue = incoming ? clamp(incoming) : undefined
  const service = useMachine(sliderMachine, {
    ...machineProps,
    id: sliderId,
    ...(controlled ? { value: machineValue } : { defaultValue }),
    min: minValue,
    max: maxValue,
    step: step ?? 1,
    onValueChange(details) {
      const event = createTimEvent('change', sliderId, {
        value: details.value,
      }) as never as Parameters<NonNullable<CoreSliderProps['onValueChange']>>[0]
      onValueChange?.(event)
    },
    onValueChangeEnd(details) {
      const event = createTimEvent('change-end', sliderId, {
        value: details.value,
      }) as never as Parameters<NonNullable<CoreSliderProps['onValueChangeEnd']>>[0]
      onValueChangeEnd?.(event)
    },
  })

  const api = sliderConnect(service, normalizeProps)
  const emitted = React.useRef('')
  React.useLayoutEffect(() => {
    if (controlled) {
      if (!incoming || !machineValue) return
      const signature = machineValue.join(',')
      const outside = incoming.some((item, index) => item !== machineValue[index])
      if (!outside || emitted.current === signature) return
      emitted.current = signature
      onValueChange?.(
        createTimEvent('change', sliderId, { value: machineValue }) as never as Parameters<
          NonNullable<CoreSliderProps['onValueChange']>
        >[0]
      )
      return
    }
    const current = api.value ?? []
    const next = clamp(current)
    if (current.length && next.some((item, index) => item !== current[index])) api.setValue(next)
  })
  return api
}
