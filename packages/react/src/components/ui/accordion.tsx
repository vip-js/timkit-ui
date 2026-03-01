'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, AccordionProps as CoreAccordionProps } from '@timui/core'
import {
  accordionContentInnerVariants,
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerInlineVariants,
  accordionTriggerIconVariants,
  accordionTriggerVariants,
  cn,
} from '@timui/core'
import { mergeProps } from '@zag-js/react'
import { ChevronDownIcon } from 'lucide-react'
import { Slot } from './slot'
import { useAccordion } from './accordion/use-accordion'
import {
  AccordionProvider,
  useAccordionContext,
  AccordionItemProvider,
  useAccordionItemContext
} from './accordion/use-accordion-context'

interface AccordionProps
  extends CoreAccordionProps,
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof CoreAccordionProps | 'dir'> {
  type?: 'single' | 'multiple'
}
type _AccordionPropsGuard = AssertNoExtraKeys<
  AccordionProps,
  CoreAccordionProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof CoreAccordionProps | 'dir'>
>

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      type = 'single',
      collapsible,
      defaultValue,
      value,
      onValueChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const { api, multiple } = useAccordion({ type, collapsible, defaultValue, value, onValueChange, disabled, id })
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
  const { api } = useAccordionContext()
  const item = useAccordionItemContext()
  if (!item) throw new Error('Trigger must be within Item')
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
            <ChevronDownIcon
              size={16}
              className={cn(accordionTriggerIconVariants())}
              aria-hidden="true"
            />
          )}
      </Comp>
    </div>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, value, disabled, ...props }, ref) => {
  const { api } = useAccordionContext()
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


const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { api } = useAccordionContext()
  const item = useAccordionItemContext()
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
      className={cn(accordionContentVariants(), className, mergedClassName)}
      {...restProps}
    >
      <div className={cn(accordionContentInnerVariants())}>{children}</div>
    </div>
  )
})
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
