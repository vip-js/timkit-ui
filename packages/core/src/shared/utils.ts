import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TimEvent, JsonValue } from './schema'

export type AssertNoExtraKeys<T, Expected> = [T] extends [Expected]
  ? [Expected] extends [T]
  ? T
  : 'Error: Extra keys detected in Prop implementation'
  : 'Error: Prop implementation is missing required keys'

export function createTimEvent<TDetail = Record<string, JsonValue>>(
  type: string,
  targetId: string,
  detail: TDetail
): TimEvent<TDetail> {
  return {
    type,
    target: { id: targetId },
    detail,
    timestamp: Date.now(),
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
