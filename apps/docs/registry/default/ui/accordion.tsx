'use client'

import * as React from 'react'
import { accordionConnect, accordionMachine, cn } from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { ChevronDownIcon } from 'lucide-react'

import { Slot } from './slot'

// Context to share state between Accordion and its items
interface AccordionContextValue {
  api: ReturnType<typeof accordionConnect>
  multiple: boolean
}
const AccordionContext = React.createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion')
  }
  return context
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  disabled?: boolean
}

const toArray = (value?: string | string[] | null, multiple?: boolean) => {
  if (value == null) return undefined
  if (Array.isArray(value)) return value
  return value === '' ? [] : [value]
}

const toValue = (value: string[], multiple: boolean) => {
  if (multiple) return value
  return value[0] ?? ''
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      type = 'single',
      collapsible,
      defaultValue,
      value: propValue,
      onValueChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const multiple = type === 'multiple'
    const value = toArray(propValue, multiple)
    const defaultValueArray = toArray(defaultValue, multiple)
    const service = useMachine(accordionMachine, {
      id: React.useId(),
      multiple,
      collapsible,
      disabled,
      value,
      defaultValue: value === undefined ? defaultValueArray : undefined,
      onValueChange: (details) => {
        onValueChange?.(toValue(details.value, multiple))
      },
    })
    const api = React.useMemo(() => accordionConnect(service, normalizeProps), [service])
    const contextValue = React.useMemo(() => ({ api, multiple }), [api, multiple])
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props)

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} data-slot="accordion" {...mergedProps} className={cn(className)} />
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    showChevron?: boolean
    icon?: React.ReactNode
  }
>(({ className, children, asChild = false, showChevron = true, icon, ...props }, ref) => {
  const { api } = useAccordion()
  const item = React.useContext(AccordionItemContext)
  if (!item) throw new Error('Trigger must be within Item')
  const triggerProps = api.getItemTriggerProps({ value: item.value, disabled: item.disabled })

  const Comp = asChild ? Slot : 'button'

  if (asChild) {
    return (
      <Comp
        ref={ref}
        data-slot="accordion-trigger"
        data-state={item.isOpen ? 'open' : 'closed'}
        className={cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...mergeProps(triggerProps, props)}
      >
        {children}
      </Comp>
    )
  }

  return (
    <div className="flex">
      <Comp
        ref={ref}
        type="button"
        data-slot="accordion-trigger"
        data-state={item.isOpen ? 'open' : 'closed'}
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-semibold transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...mergeProps(triggerProps, props)}
      >
        {children}
        {icon
          ? icon
          : showChevron && (
              <ChevronDownIcon
                size={16}
                className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                aria-hidden="true"
              />
            )}
      </Comp>
    </div>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

// Helper for Item Context logic
const AccordionItemContext = React.createContext<{
  value: string
  disabled?: boolean
  isOpen: boolean
} | null>(null)

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, value, disabled, ...props }, ref) => {
  const { api } = useAccordion()
  const itemState = api.getItemState({ value, disabled })
  const itemProps = api.getItemProps({ value, disabled })
  const mergedProps = mergeProps(itemProps, props)
  const { className: mergedClassName, ...restProps } = mergedProps

  return (
    <AccordionItemContext.Provider value={{ value, disabled, isOpen: itemState.expanded }}>
      <div
        ref={ref}
        data-slot="accordion-item"
        data-state={itemState.expanded ? 'open' : 'closed'}
        className={cn('border-b last:border-b-0', className, mergedClassName)}
        {...restProps}
      />
    </AccordionItemContext.Provider>
  )
})
AccordionItem.displayName = 'AccordionItem'

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { api } = useAccordion()
    const item = React.useContext(AccordionItemContext)
    if (!item) throw new Error('Content must be within Item')
    const contentProps = api.getItemContentProps({ value: item.value, disabled: item.disabled })
    const mergedProps = mergeProps(contentProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <div
        ref={ref}
        data-slot="accordion-content"
        data-state={item.isOpen ? 'open' : 'closed'}
        hidden={!item.isOpen}
        className={cn(
          'overflow-hidden text-sm transition-all',
          item.isOpen ? 'animate-accordion-down' : 'animate-accordion-up',
          className,
          mergedClassName
        )}
        {...restProps}
      >
        <div className="pt-0 pb-4">{children}</div>
      </div>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
