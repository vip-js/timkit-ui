'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, InputProps as CoreInputProps } from '@timui/core'
import { cn, createTimEvent, inputVariants } from '@timui/core'

type InputProps = CoreInputProps & Omit<React.ComponentProps<'input'>, keyof CoreInputProps>

function Input({
  className,
  type,
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
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [revealed, setRevealed] = React.useState(false)
  const isFile = type === 'file'
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const current = value !== undefined ? value : uncontrolled
  const limit = typeof maxLength === 'number' && maxLength >= 0 ? maxLength : undefined
  const counted = limit !== undefined && !isFile
  const countId = counted ? `${inputId}-count` : undefined
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
    onValueChange?.(createTimEvent('change', inputId, { value: next }))
  }, [inputId, limit, onValueChange, uncontrolled, value])
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      if (!isFile) event.target.value = current
      return
    }
    const next = cut(event.target.value)
    if (next !== event.target.value) event.target.value = next
    onChange?.(event)
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(createTimEvent('change', inputId, { value: next }))
  }
  const clearable = !isFile && !disabled && !readOnly && String(current ?? '') !== ''
  const clear = () => {
    if (!clearable) return
    if (value === undefined) setUncontrolled('')
    onValueChange?.(createTimEvent('change', inputId, { value: '' }))
    inputRef.current?.focus()
  }
  const revealable = type === 'password' && !disabled
  const reveal = () => {
    if (!revealable) return
    setRevealed((open) => !open)
    inputRef.current?.focus()
  }

  const inputType = type === 'search' ? 'search' : isFile ? 'file' : 'default'

  return (
    <>
    <input
      ref={inputRef}
      type={type === 'password' && revealed ? 'text' : type}
      id={inputId}
      data-slot="input"
      className={cn(inputVariants({ type: inputType }), className)}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={limit}
      onChange={handleChange}
      {...props}
      required={required || undefined}
      aria-required={required ? 'true' : undefined}
      aria-describedby={described}
      {...(isFile ? {} : { value: current })}
    />
    {clearable ? (
      <button type="button" aria-label="Clear" onClick={clear}>
        Clear
      </button>
    ) : null}
    {revealable ? (
      <button type="button" aria-label={revealed ? 'Hide password' : 'Show password'} onClick={reveal}>
        {revealed ? 'Hide password' : 'Show password'}
      </button>
    ) : null}
    {counted ? <p id={countId} role="status">{`${String(current ?? '').length} of ${limit}`}</p> : null}
    {type === 'password' && revealed ? <p role="status">Visible</p> : null}
    </>
  )
}

export { Input }
