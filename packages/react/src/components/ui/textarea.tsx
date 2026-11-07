'use client'

import * as React from 'react'
import type { TextareaProps as CoreTextareaProps } from '@timui/core'
import { cn, createTimEvent, textareaVariants } from '@timui/core'

type TextareaProps = CoreTextareaProps &
  Omit<React.ComponentProps<'textarea'>, keyof CoreTextareaProps>

function Textarea({
  className,
  id,
  onValueChange,
  onChange,
  disabled,
  readOnly,
  required,
  value,
  defaultValue,
  maxLength,
  'aria-describedby': describedBy,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const areaRef = React.useRef<HTMLTextAreaElement>(null)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const current = value !== undefined ? value : uncontrolled
  const limit = typeof maxLength === 'number' && maxLength >= 0 ? maxLength : undefined
  const countId = limit !== undefined ? `${textareaId}-count` : undefined
  const described = [describedBy, countId].filter(Boolean).join(' ') || undefined
  const cut = (text: string) => (limit === undefined || text.length <= limit ? text : text.slice(0, limit))
  const limitedMark = React.useRef('')
  React.useLayoutEffect(() => {
    if (value !== undefined || limit === undefined) return
    const text = String(uncontrolled ?? '')
    if (text.length <= limit) return
    const next = text.slice(0, limit)
    const mark = `${limit}:${next}`
    if (limitedMark.current === mark) return
    limitedMark.current = mark
    setUncontrolled(next)
    onValueChange?.(createTimEvent('change', textareaId, { value: next }))
  }, [limit, onValueChange, textareaId, uncontrolled, value])
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled || readOnly) {
      event.target.value = current
      return
    }
    const next = cut(event.target.value)
    if (next !== event.target.value) event.target.value = next
    onChange?.(event)
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(createTimEvent('change', textareaId, { value: next }))
  }
  const clearable = !disabled && !readOnly && String(current ?? '') !== ''
  const clear = () => {
    if (!clearable) return
    if (value === undefined) setUncontrolled('')
    onValueChange?.(createTimEvent('change', textareaId, { value: '' }))
    areaRef.current?.focus()
  }

  return (
    <>
    <textarea
      ref={areaRef}
      id={textareaId}
      data-slot="textarea"
      className={cn(textareaVariants(), className)}
      onChange={handleChange}
      {...props}
      disabled={disabled}
      maxLength={limit}
      readOnly={readOnly}
      required={required || undefined}
      aria-required={required ? 'true' : undefined}
      aria-describedby={described}
      value={current}
    />
    {clearable ? (
      <button type="button" aria-label="Clear" onClick={clear}>
        Clear
      </button>
    ) : null}
    {limit !== undefined ? (
      <p id={countId} role="status">{`${String(current ?? '').length} of ${limit}`}</p>
    ) : null}
    </>
  )
}
Textarea.displayName = 'Textarea'

export { Textarea }
