'use client'

import * as React from 'react'
import type {
  AssertNoExtraKeys,
  MultiselectOption,
  MultiselectProps as CoreMultiselectProps,
} from '@timui/core'
import { useEffect } from 'react'
import {
  cn,
  multiselectClearButtonVariants,
  multiselectCommandVariants,
  multiselectContainerVariants,
  multiselectDropdownVariants,
  multiselectEmptyVariants,
  multiselectGroupVariants,
  multiselectInputVariants,
  multiselectListVariants,
  multiselectTagRemoveVariants,
  multiselectTagVariants,
} from '@timui/core'
import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { XIcon } from 'lucide-react'

import { Command, CommandGroup, CommandItem, CommandList } from './command'

export type Option = MultiselectOption
interface GroupOption {
  [key: string]: Option[]
}

type MultipleSelectorProps = CoreMultiselectProps & {
  onChange?: (options: Option[]) => void
  loadingIndicator?: React.ReactNode
  emptyIndicator?: React.ReactNode
  className?: string
  badgeClassName?: string
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
}
type _MultipleSelectorPropsGuard = AssertNoExtraKeys<
  MultipleSelectorProps,
  CoreMultiselectProps & {
    onChange?: (options: Option[]) => void
    loadingIndicator?: React.ReactNode
    emptyIndicator?: React.ReactNode
    className?: string
    badgeClassName?: string
    commandProps?: React.ComponentPropsWithoutRef<typeof Command>
    inputProps?: Omit<
      React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
      'value' | 'placeholder' | 'disabled'
    >
  }
>

export interface MultipleSelectorRef {
  selectedValue: Option[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return {
      '': options,
    }
  }

  const groupOption: GroupOption = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  if (picked.length === 0) {
    return groupOption
  }

  const pickedValues = new Set(picked.map((item) => item.value))
  const next: GroupOption = {}
  for (const [key, value] of Object.entries(groupOption)) {
    next[key] = value.filter((val) => !pickedValues.has(val.value))
  }
  return next
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  if (targetOption.length === 0) {
    return false
  }
  const targetValues = new Set(targetOption.map((item) => item.value))
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetValues.has(option.value))) {
      return true
    }
  }
  return false
}

const CommandEmpty = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
  const render = useCommandState((state) => state.filtered.count === 0)

  if (!render) return null

  return (
    <div
      className={cn(multiselectEmptyVariants(), className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  )
}

CommandEmpty.displayName = 'CommandEmpty'

export const MultipleSelector = ({
  value,
  onChange,
  onValueChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  delay,
  onSearch,
  onSearchSync,
  loadingIndicator,
  emptyIndicator,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  groupBy,
  className,
  badgeClassName,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false,
}: MultipleSelectorProps) => {
  const emitValueChange = React.useCallback(
    (next: Option[]) => {
      onValueChange?.(next)
      onChange?.(next)
    },
    [onChange, onValueChange]
  )

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [onScrollbar, setOnScrollbar] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null) // Added this

  const [selected, setSelected] = React.useState<Option[]>(value || [])
  const [options, setOptions] = React.useState<GroupOption>(
    transToGroupOption(arrayDefaultOptions, groupBy)
  )
  const [inputValue, setInputValue] = React.useState('')
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500)
  const selectedValueSet = React.useMemo(
    () => new Set(selected.map((item) => item.value)),
    [selected]
  )

  const handleClickOutside = React.useCallback((event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false)
      inputRef.current.blur()
    }
  }, [])

  const handleUnselect = React.useCallback(
    (option: Option) => {
      const newOptions = selected.filter((s) => s.value !== option.value)
      setSelected(newOptions)
      emitValueChange(newOptions)
    },
    [emitValueChange, selected]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '' && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1]
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1])
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    [handleUnselect, selected]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchend', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [handleClickOutside, open])

  useEffect(() => {
    if (value) {
      setSelected(value)
    }
  }, [value])

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return
    }
    setOptions(transToGroupOption(arrayOptions, groupBy))
  }, [arrayOptions, groupBy, onSearch])

  useEffect(() => {
    /** sync search */

    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm)
      setOptions(transToGroupOption(res || [], groupBy))
    }

    const exec = async () => {
      if (!onSearchSync || !open) return
      if (triggerSearchOnFocus || debouncedSearchTerm) {
        doSearchSync()
      }
    }

    void exec()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  useEffect(() => {
    /** async search */
    let active = true

    const doSearch = async () => {
      setIsLoading(true)
      const res = await onSearch?.(debouncedSearchTerm)
      if (!active) return
      setOptions(transToGroupOption(res || [], groupBy))
      setIsLoading(false)
    }

    const exec = async () => {
      if (!onSearch || !open) return
      if (triggerSearchOnFocus || debouncedSearchTerm) {
        await doSearch()
      }
    }

    void exec()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  const creatableNode = React.useMemo(() => {
    if (!creatable) return undefined
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selectedValueSet.has(inputValue)
    ) {
      return undefined
    }

    const shouldShow =
      (!onSearch && inputValue.length > 0) ||
      (onSearch && debouncedSearchTerm.length > 0 && !isLoading)

    if (!shouldShow) return undefined

    return (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onSelect={(value: string) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length)
            return
          }
          setInputValue('')
          const newOptions = [...selected, { value, label: value }]
          setSelected(newOptions)
          emitValueChange(newOptions)
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    )
  }, [
    creatable,
    debouncedSearchTerm.length,
    emitValueChange,
    inputValue,
    isLoading,
    maxSelected,
    onMaxSelected,
    onSearch,
    options,
    selected,
    selectedValueSet,
  ])

  const emptyNode = React.useMemo(() => {
    if (!emptyIndicator) return undefined

    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      )
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>
  }, [creatable, emptyIndicator, onSearch, options])

  const selectables = React.useMemo<GroupOption>(
    () => removePickedOption(options, selected),
    [options, selected]
  )
  const selectableEntries = React.useMemo(
    () => Object.entries(selectables),
    [selectables]
  )
  const fixedSelected = React.useMemo(
    () => selected.filter((item) => item.fixed),
    [selected]
  )

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = React.useMemo(() => {
    if (commandProps?.filter) return commandProps.filter
    if (!creatable) return undefined
    return (value: string, search: string) => {
      return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
    }
  }, [creatable, commandProps?.filter])

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      onKeyDown={(e) => {
        handleKeyDown(e)
        commandProps?.onKeyDown?.(e)
      }}
      className={cn(multiselectCommandVariants(), commandProps?.className)}
      shouldFilter={
        commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
      } // When onSearch is provided, we don&lsquo;t want to filter the options. You can still override it.
      filter={commandFilter}
    >
      <div
        className={cn(
          multiselectContainerVariants(),
          {
            'p-1': selected.length !== 0,
            'cursor-text': !disabled && selected.length !== 0,
          },
          !hideClearAllButton && 'pe-9',
          className
        )}
        onClick={() => {
          if (disabled) return
          inputRef?.current?.focus()
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <div
                key={option.value}
                className={cn(
                  multiselectTagVariants(),
                  badgeClassName
                )}
                data-fixed={option.fixed}
                data-disabled={disabled || undefined}
              >
                {option.label}
                <button
                  className={multiselectTagRemoveVariants()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                  aria-label="Remove"
                >
                  <XIcon size={14} aria-hidden="true" />
                </button>
              </div>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={(value) => {
              setInputValue(value)
              inputProps?.onValueChange?.(value)
            }}
            onBlur={(event) => {
              if (!onScrollbar) {
                setOpen(false)
              }
              inputProps?.onBlur?.(event)
            }}
            onFocus={(event) => {
              setOpen(true)
              inputProps?.onFocus?.(event)
            }}
            placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
            className={cn(
              multiselectInputVariants(),
              {
                'w-full': hidePlaceholderWhenSelected,
                'px-3 py-2': selected.length === 0,
                'ml-1': selected.length !== 0,
              },
              inputProps?.className
            )}
          />
          <button
            type="button"
            onClick={() => {
              setSelected(fixedSelected)
              emitValueChange(fixedSelected)
            }}
            className={cn(
              multiselectClearButtonVariants(),
              (hideClearAllButton ||
                disabled ||
                selected.length < 1 ||
                fixedSelected.length === selected.length) &&
                'hidden'
            )}
            aria-label="Clear all"
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          className={cn(
            multiselectDropdownVariants(),
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            !open && 'hidden'
          )}
          data-state={open ? 'open' : 'closed'}
        >
          {open && (
            <CommandList
              className={multiselectListVariants()}
              onMouseLeave={() => {
                setOnScrollbar(false)
              }}
              onMouseEnter={() => {
                setOnScrollbar(true)
              }}
              onMouseUp={() => {
                inputRef?.current?.focus()
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {emptyNode}
                  {creatableNode}
                  {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                  {selectableEntries.map(([key, dropdowns]) => (
                    <CommandGroup key={key} heading={key} className={multiselectGroupVariants()}>
                      <>
                        {dropdowns.map((option) => {
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onSelect={() => {
                                if (selected.length >= maxSelected) {
                                  onMaxSelected?.(selected.length)
                                  return
                                }
                                setInputValue('')
                                const newOptions = [...selected, option]
                                setSelected(newOptions)
                                emitValueChange(newOptions)
                              }}
                              className={cn(
                                'cursor-pointer',
                                option.disable &&
                                  'pointer-events-none cursor-not-allowed opacity-50'
                              )}
                            >
                              {option.label}
                            </CommandItem>
                          )
                        })}
                      </>
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </div>
    </Command>
  )
}

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
