/**
 * Inline class-variance-authority (cva) - no npm dependency required.
 * Adapted from https://github.com/joe-bell/cva (Apache-2.0 License)
 */
import { clsx, type ClassValue } from './clsx'

export type { ClassValue }
export { clsx }

type VariantValue = string | boolean | null | undefined
type VariantMap = Record<string, Record<string, ClassValue>>
type DefaultVariants<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K] | null | undefined
}

interface CvaConfig<V extends VariantMap, D extends DefaultVariants<V>> {
  variants?: V
  defaultVariants?: D
  compoundVariants?: Array<
    Partial<{ [K in keyof V]: keyof V[K] | Array<keyof V[K]> }> & {
      class?: ClassValue
      className?: ClassValue
    }
  >
}

function falsyToString(v: VariantValue): string | null {
  if (typeof v === 'boolean') return String(v)
  if (v === (0 as unknown as VariantValue)) return '0'
  return v ? String(v) : null
}

export function cva<V extends VariantMap, D extends DefaultVariants<V>>(
  base?: ClassValue,
  config?: CvaConfig<V, D>
) {
  return (props?: Record<string, unknown>): string => {
    if (!config?.variants) {
      return clsx(base, props?.class, props?.className)
    }

    const { variants, defaultVariants = {} as D, compoundVariants = [] } = config

    const getVariantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = props?.[variant] as VariantValue
      const defaultVariantProp = (defaultVariants as Record<string, VariantValue>)?.[variant]
      if (variantProp === null) return null
      const variantKey = falsyToString(variantProp) ?? falsyToString(defaultVariantProp)
      return variantKey ? variants[variant][variantKey] : null
    })

    const propsWithoutUndefined = props
      ? Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined))
      : {}

    const getCompoundVariantClassNames = compoundVariants.reduce<ClassValue[]>((acc, cv) => {
      const { class: cvClass, className: cvClassName, ...cvOptions } = cv
      const matches = Object.entries(cvOptions).every(([key, value]) => {
        const merged = { ...defaultVariants, ...propsWithoutUndefined }
        return Array.isArray(value)
          ? (value as unknown[]).includes(merged[key as keyof typeof merged])
          : merged[key as keyof typeof merged] === value
      })
      return matches ? [...acc, cvClass, cvClassName] : acc
    }, [])

    return clsx(
      base,
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className
    )
  }
}

export const cx = clsx

/** Alias for backward-compat with class-variance-authority's VariantProps */
export type VariantProps<T extends (...args: unknown[]) => unknown> = VariantPropsOf<T>
