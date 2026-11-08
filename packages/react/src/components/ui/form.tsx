'use client'

import * as React from 'react'
import {
  cn,
  createForm,
  fieldA11y,
  fieldDateBound,
  fieldMaxLength,
  fieldPattern,
  fieldRequired,
  fieldTimeBound,
  formErrorSummary,
  readFieldValue,
  setFieldValue,
  firstInvalidField,
  submitForm,
  type FieldSpec,
  type FormSnapshot,
  type FormValues,
} from '@timui/core'

type BoundField = {
  id: string
  name: string
  disabled?: boolean
  'aria-invalid'?: 'true'
  'aria-describedby'?: string
}

type FormInputEvent =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | {
      type?: string
      timestamp?: number
      detail?: { value?: string | number | boolean | null | string[] | number[]; checked?: boolean | 'indeterminate' }
      target?: { id?: string; value?: string | number; checked?: boolean; type?: string }
    }

type FormApi = {
  values: FormValues
  errors: FormValues
  text: (name: string) => BoundField & { value: string; onValueChange: (event: FormInputEvent) => void }
  checked: (name: string) => BoundField & { checked: boolean; onCheckedChange: (event: FormInputEvent) => void }
  number: (name: string) => BoundField & { value?: number; onValueChange: (event: FormInputEvent) => void }
  error: (name: string) => string | undefined
}

type RichField = FieldSpec & {
  control?: 'text' | 'textarea' | 'select' | 'switch' | 'number' | 'check' | 'radio' | 'password' | 'date' | 'time'
  options?: Array<{ label?: string; value: string }>
}

const controlOf = (field: RichField) => {
  if (field.control) return field.control
  if ((field.rules ?? []).some((rule) => rule.kind === 'checked')) return 'check' as const
  return 'text' as const
}

type FormProps = {
  fields: RichField[]
  onSubmit: (values: FormValues) => void
  className?: string
  submitLabel?: string
  disabled?: boolean
  children?: React.ReactNode | ((api: FormApi) => React.ReactNode)
}

function Form({
  fields,
  onSubmit,
  className,
  submitLabel = 'Submit',
  disabled = false,
  children,
}: FormProps) {
  const [snapshot, setSnapshot] = React.useState<FormSnapshot>(() => createForm(fields))
  const [shownSecrets, setShownSecrets] = React.useState<Record<string, boolean>>({})

  const write = (name: string, event: FormInputEvent) => {
    if (disabled) return
    setSnapshot((current) =>
      setFieldValue(current, name, readFieldValue(event as Parameters<typeof readFieldValue>[0]), fields)
    )
  }

  const api: FormApi = {
    values: snapshot.values,
    errors: snapshot.errors,
    error: (name) => snapshot.errors[name],
    text: (name) => {
      const error = snapshot.errors[name]
      return {
        ...fieldA11y(name, error, fields.find((field) => field.name === name)?.hint),
        name,
        disabled,
        value: snapshot.values[name] ?? '',
        onValueChange: (event) => write(name, event),
      }
    },
    checked: (name) => {
      const error = snapshot.errors[name]
      return {
        ...fieldA11y(name, error, fields.find((field) => field.name === name)?.hint),
        name,
        disabled,
        checked: snapshot.values[name] === 'true',
        onCheckedChange: (event) => write(name, event),
      }
    },
    number: (name) => {
      const error = snapshot.errors[name]
      const raw = snapshot.values[name]
      return {
        ...fieldA11y(name, error, fields.find((field) => field.name === name)?.hint),
        name,
        disabled,
        value: raw === undefined || raw === '' ? undefined : Number(raw),
        onValueChange: (event) => write(name, event),
      }
    },
  }

  return (
    <form
      data-slot="form"
      className={cn('grid gap-3', className)}
      onSubmit={(event) => {
        event.preventDefault()
        if (disabled) return
        const result = submitForm(snapshot, fields)
        setSnapshot(result.snapshot)
        if (result.ok) {
          onSubmit(result.values)
          return
        }
        const name = firstInvalidField(fields, result.snapshot.errors)
        const node = name ? document.getElementById(name) : null
        if (node instanceof HTMLElement) node.focus()
      }}
    >
      {formErrorSummary(fields, snapshot.errors, snapshot.submitCount) ? (
        <p role="alert">{formErrorSummary(fields, snapshot.errors, snapshot.submitCount)}</p>
      ) : null}
      {typeof children === 'function'
        ? children(api)
        : fields.map((spec) => {
            const field = spec as RichField
            const control = controlOf(field)
            const error = snapshot.errors[field.name]
            const text = api.text(field.name)
            const checked = api.checked(field.name)
            const required = fieldRequired(field.rules)
            const textLimit =
              control === 'textarea' || control === 'text' || control === 'password'
                ? fieldMaxLength(field.rules)
                : undefined
            const describedBy = [text['aria-describedby'], textLimit !== undefined ? `${field.name}-count` : '']
              .filter(Boolean)
              .join(' ')
            const described = {
              id: text.id,
              name: text.name,
              disabled,
              required: required || undefined,
              'aria-required': required || undefined,
              'aria-invalid': text['aria-invalid'],
              'aria-describedby': describedBy || undefined,
            }
            const controlNode =
              control === 'textarea' ? (
                <textarea
                  {...described}
                  maxLength={textLimit}
                  value={text.value}
                  onChange={(event) => write(field.name, event)}
                />
              ) : control === 'select' ? (
                <select {...described} value={text.value} onChange={(event) => write(field.name, event)}>
                  <option value="">Choose</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label || option.value}
                    </option>
                  ))}
                </select>
              ) : control === 'radio' ? (
                <div
                  id={field.name}
                  role="radiogroup"
                  aria-labelledby={`${field.name}-label`}
                  aria-invalid={text['aria-invalid']}
                  aria-describedby={text['aria-describedby']}
                  aria-required={required ? 'true' : undefined}
                  tabIndex={-1}
                >
                  {(field.options ?? []).map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={text.value === option.value}
                        disabled={disabled}
                        onChange={(event) => write(field.name, event)}
                      />
                      {option.label || option.value}
                    </label>
                  ))}
                </div>
              ) : control === 'switch' || control === 'check' ? (
                <input
                  {...described}
                  type="checkbox"
                  role={control === 'switch' ? 'switch' : undefined}
                  checked={checked.checked}
                  onChange={(event) => write(field.name, event)}
                />
              ) : (
                <>
                <input
                  {...described}
                  type={
                    control === 'number'
                      ? 'number'
                      : control === 'password'
                        ? shownSecrets[field.name]
                          ? 'text'
                          : 'password'
                        : control === 'date'
                          ? 'date'
                          : control === 'time'
                            ? 'time'
                        : field.rules?.some((rule) => rule.kind === 'email')
                          ? 'email'
                          : undefined
                  }
                  pattern={fieldPattern(field.rules)}
                  maxLength={textLimit}
                  min={
                    control === 'date'
                      ? fieldDateBound(field.rules, 'min')
                      : control === 'time'
                        ? fieldTimeBound(field.rules, 'min')
                        : undefined
                  }
                  max={
                    control === 'date'
                      ? fieldDateBound(field.rules, 'max')
                      : control === 'time'
                        ? fieldTimeBound(field.rules, 'max')
                        : undefined
                  }
                  value={text.value}
                  onChange={(event) => write(field.name, event)}
                />
                {control === 'password' && !disabled ? (
                  <button
                    type="button"
                    aria-label={shownSecrets[field.name] ? 'Hide password' : 'Show password'}
                    onClick={() => {
                      setShownSecrets((current) => ({ ...current, [field.name]: !current[field.name] }))
                      document.getElementById(field.name)?.focus()
                    }}
                  >
                    {shownSecrets[field.name] ? 'Hide password' : 'Show password'}
                  </button>
                ) : null}
                </>
              )
            return (
              <div key={field.name} data-slot="form-field">
                {control === 'radio' ? (
                  <span id={`${field.name}-label`}>{field.label}</span>
                ) : (
                  <label htmlFor={field.name}>{field.label}</label>
                )}
                {controlNode}
                {textLimit !== undefined ? (
                  <p id={`${field.name}-count`} role="status">{`${text.value.length} of ${textLimit}`}</p>
                ) : null}
                {field.hint?.trim() ? <p id={`${field.name}-hint`}>{field.hint}</p> : null}
                {error ? (
                  <p id={`${field.name}-error`} role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            )
          })}
      <button type="submit" data-slot="form-submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  )
}

export { Form }
export type { FormApi, FormProps }
