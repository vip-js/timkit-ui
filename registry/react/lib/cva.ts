/**
 * Inline class-variance-authority (cva) v0.7.1 - no npm dependency required.
 * Adapted from https://github.com/joe-bell/cva (Apache-2.0 License, Joe Bell)
 */
import { clsx, type ClassValue } from './clsx'
export type { ClassValue } from './clsx'
export { clsx }

// ── Types ────────────────────────────────────────────────────────────


type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T
type CxOptions = Parameters<typeof clsx>
type CxReturn = ReturnType<typeof clsx>
export type { StringToBoolean }

export const falsyToString = <T>(value: T) =>
  typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value

export const cx: (...classes: CxOptions) => CxReturn = clsx

// ── Core ─────────────────────────────────────────────────────────────

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  'class' | 'className'
>

type OmitUndefined<T> = T extends undefined ? never : T
type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

// ── Config ────────────────────────────────────────────────────────────

export type ConfigSchema = Record<string, Record<string, ClassValue>>

export type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined
}

export type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[] | null | undefined
}

export type Config<T extends ConfigSchema = ConfigSchema> = {
  variants?: T
  defaultVariants?: ConfigVariants<T>
  compoundVariants?: (T extends ConfigSchema ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & { class?: ClassValue; className?: ClassValue } : { class?: ClassValue; className?: ClassValue })[]
}

// ── cva ──────────────────────────────────────────────────────────────

export const cva =
  <T extends ConfigSchema>(base?: ClassValue, config?: Config<T>) =>
  (props?: ConfigVariants<T> & { class?: ClassValue; className?: ClassValue }): string => {
    if ((config?.variants) == null)
      return cx(base, props?.class, props?.className)

    const { variants, defaultVariants } = config

    const getVariantClassNames = Object.keys(variants).map((variant: keyof typeof variants) => {
      const variantProp = props?.[variant]
      const defaultVariantProp = defaultVariants?.[variant]

      if (variantProp === null) return null

      const variantKey = (falsyToString(variantProp) || falsyToString(defaultVariantProp)) as keyof (typeof variants)[typeof variant]
      return variants[variant][variantKey]
    })

    const propsWithoutUndefined =
      props &&
      Object.entries(props).reduce<Record<string, unknown>>((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value
        return acc
      }, {})

    const getCompoundVariantClassNames = config?.compoundVariants?.reduce<ClassValue[]>((acc, compoundVariant) => {
      const { class: cvClass, className: cvClassName, ...compoundVariantOptions } = compoundVariant

      return Object.entries(compoundVariantOptions).every(([key, value]) =>
        Array.isArray(value)
          ? value.includes({ ...defaultVariants, ...propsWithoutUndefined }[key])
          : ({ ...defaultVariants, ...propsWithoutUndefined })[key] === value
      )
        ? [...acc, cvClass, cvClassName]
        : acc
    }, [])

    return cx(base, getVariantClassNames, getCompoundVariantClassNames, props?.class, props?.className)
  }
