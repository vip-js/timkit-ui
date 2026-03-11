/**
 * Theme helpers
 *
 * Core 仅消费 tokens 输出，不再内置 token 值。
 * 建议直接使用 @timui/tokens 的 theme.css / theme.wxss / tokens.json。
 */

import tokens from '@timui/tokens/tokens.json'

export type TokenTree = {
  [key: string]: string | TokenTree
}

export type ThemeTokens = TokenTree

export const defaultTokens = tokens as ThemeTokens

function collectTokens(
  obj: TokenTree,
  prefix: string[] = [],
  entries: Array<[string[], string]> = []
): Array<[string[], string]> {
  for (const [key, value] of Object.entries(obj)) {
    const path = [...prefix, key]
    if (typeof value === 'string') {
      entries.push([path, value])
    } else if (value && typeof value === 'object') {
      collectTokens(value, path, entries)
    }
  }
  return entries
}

export function toCssVars(tokensInput: ThemeTokens = defaultTokens, selector = ':root'): string {
  const lines = collectTokens(tokensInput).map(
    ([path, value]) => `  --${path.join('-')}: ${value};`
  )
  return `${selector} {\n${lines.join('\n')}\n}\n`
}

export function toWxssVars(tokensInput: ThemeTokens = defaultTokens, selector = 'page'): string {
  const lines = collectTokens(tokensInput).map(
    ([path, value]) => `  --${path.join('-')}: ${value};`
  )
  return `${selector} {\n${lines.join('\n')}\n}\n`
}
