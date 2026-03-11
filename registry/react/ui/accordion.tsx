'use client'

import * as React from 'react'
import * as accordion from '@zag-js/accordion'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'

import { createContext } from '../lib/create-context'
import { cva, type VariantProps } from '../lib/cva'
import { cn } from '../lib/utils'
import { Slot } from './slot'

const accordionItemVariants = cva('w-full border-b last:border-b-0')
const accordionTriggerVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-semibold transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180'
)
const accordionTriggerInlineVariants = cva(
  'flex w-full flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180'
)
const accordionTriggerIconVariants = cva(
  'pointer-events-none shrink-0 opacity-60 transition-transform duration-200'
)
const accordionContentVariants = cva(
  'overflow-hidden text-sm transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
)
const accordionContentInnerVariants = cva('pt-0 pb-4')

// Context to share state between Accordion and its items
interface AccordionContextValue {
  api: accordion.Api
  multiple: boolean
}

export const [AccordionProvider, useAccordion] = createContext<AccordionContextValue>({
  name: 'AccordionContext',
  hookName: 'useAccordion',
  providerName: '<Accordion />',
})

interface AccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'dir' | 'onChange' | 'onSelect'
> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  disabled?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const toArray = (value?: string | string[] | null) => {
  if (value == null) return undefined
  if (Array.isArray(value)) return value
  return value === '' ? [] : [value]
}

const toValue = (value: string[], multiple: boolean) => {
  if (multiple) return value
  return (value[0] ?? '') as string
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
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const accordionId = id ?? generatedId
    const multiple = type === 'multiple'
    const value = toArray(propValue)
    const defaultValueArray = toArray(defaultValue)

    const service: accordion.Service = useMachine(accordion.machine, {
      id: accordionId,
      multiple,
      collapsible,
      disabled,
      value: value,
      defaultValue: value === undefined ? defaultValueArray : undefined,
      onValueChange: (details: { value: string[] }) => {
        onValueChange?.(toValue(details.value, multiple))
      },
    })
    const api = accordion.connect(service, normalizeProps)
    const contextValue = React.useMemo(() => ({ api, multiple }), [api, multiple])
    const rootProps = api.getRootProps()
    const mergedProps = mergeProps(rootProps, props) as React.HTMLAttributes<HTMLDivElement>
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <AccordionProvider value={contextValue}>
        <div
          ref={ref}
          data-slot="accordion"
          className={cn(className, mergedClassName)}
          {...restProps}
        />
      </AccordionProvider>
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
  const item = useAccordionItemContext()
  const triggerProps = api.getItemTriggerProps({ value: item.value, disabled: item.disabled })

  const Comp = asChild ? Slot : 'button'

  if (asChild) {
    return (
      <Comp
        ref={ref}
        data-slot="accordion-trigger"
        data-state={item.isOpen ? 'open' : 'closed'}
        className={cn(accordionTriggerInlineVariants(), className)}
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
        className={cn(accordionTriggerVariants(), className)}
        {...mergeProps(triggerProps, props)}
      >
        {children}
        {icon
          ? icon
          : showChevron && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(accordionTriggerIconVariants())}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
      </Comp>
    </div>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

export const [AccordionItemProvider, useAccordionItemContext] = createContext<{
  value: string
  disabled?: boolean
  isOpen: boolean
}>({
  name: 'AccordionItemContext',
  hookName: 'useAccordionItemContext',
  providerName: '<AccordionItem />',
})

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
    <AccordionItemProvider value={{ value, disabled, isOpen: itemState.expanded }}>
      <div
        ref={ref}
        data-slot="accordion-item"
        data-state={itemState.expanded ? 'open' : 'closed'}
        className={cn(accordionItemVariants(), className, mergedClassName)}
        {...restProps}
      />
    </AccordionItemProvider>
  )
})
AccordionItem.displayName = 'AccordionItem'

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { api } = useAccordion()
    const item = useAccordionItemContext()
    const contentProps = api.getItemContentProps({ value: item.value, disabled: item.disabled })
    const mergedProps = mergeProps(contentProps, props)
    const { className: mergedClassName, ...restProps } = mergedProps

    return (
      <div
        ref={ref}
        data-slot="accordion-content"
        data-state={item.isOpen ? 'open' : 'closed'}
        hidden={!item.isOpen}
        className={cn(accordionContentVariants(), className, mergedClassName)}
        {...restProps}
      >
        <div className={cn(accordionContentInnerVariants())}>{children}</div>
      </div>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
