import type { JsonValue, RegistryItem } from '@timui/core'

export type FrameworkId = 'react' | 'vue' | 'html' | 'weapp'

export interface ScoreResult {
  score: number
  reasons: string[]
}

const expansions: Array<[RegExp, string]> = [
  [/按钮|按键/, ' button '],
  [/输入框/, ' input textarea '],
  [/文本域|多行输入/, ' textarea '],
  [/对话框|弹窗|模态框/, ' dialog modal '],
  [/警告框|确认框/, ' alert-dialog alert '],
  [/抽屉|底部弹出/, ' sheet '],
  [/下拉菜单/, ' dropdown-menu menu '],
  [/下拉框|选择器|组合框/, ' select combobox '],
  [/开关/, ' switch '],
  [/标签页|选项卡/, ' tabs '],
  [/手风琴/, ' accordion '],
  [/折叠面板|折叠/, ' collapsible accordion '],
  [/卡片/, ' card '],
  [/表格/, ' table '],
  [/气泡|工具提示/, ' tooltip '],
  [/吐司|轻提示/, ' toast '],
  [/通知/, ' notification toast '],
  [/进度条|进度/, ' progress '],
  [/滑块/, ' slider '],
  [/复选框|多选/, ' checkbox '],
  [/单选/, ' radio-group radio '],
  [/头像/, ' avatar '],
  [/徽章|角标/, ' badge '],
  [/分页/, ' pagination '],
  [/面包屑/, ' breadcrumb '],
  [/导航栏|导航/, ' navbar navigation-menu '],
  [/日期选择|日期/, ' date-picker calendar '],
  [/登录|鉴权/, ' login authentication '],
  [/钱包/, ' wallet '],
  [/聊天|会话/, ' chat agent workbench '],
  [/工具调用|工具/, ' tool call workbench '],
  [/审批|批准|人工确认/, ' approval workbench '],
  [/引用|来源/, ' citation workbench '],
  [/执行计划|计划步骤/, ' plan workbench '],
  [/命令面板/, ' command '],
  [/搜索框|搜索/, ' input command '],
  [/移动端|手机端|手机/, ' mobile '],
]

export const expandPrompt = (prompt: string) => {
  let expanded = ` ${prompt} `
  expansions.forEach(([pattern, extra]) => {
    if (pattern.test(prompt)) expanded += extra
  })
  return expanded
}

export const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export const getMetaString = (item: RegistryItem, key: string): string | undefined => {
  const value = item.meta?.[key]
  return typeof value === 'string' ? value : undefined
}

export const getFrameworks = (item: RegistryItem): FrameworkId[] => {
  const values = getStringArray(item.meta?.frameworks)
  return values.filter((item): item is FrameworkId =>
    ['react', 'vue', 'html', 'weapp'].includes(item)
  )
}

export const getTags = (item: RegistryItem) => getStringArray(item.meta?.tags)

const stopwords = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'into',
  'your',
  'you',
  'are',
  'was',
  'has',
  'have',
  'not',
  'but',
  'can',
  'its',
  'use',
  'using',
  'app',
  'screen',
  'build',
  'make',
  'need',
  'want',
  'please',
  'modern',
])

const includesPhrase = (prompt: string, phrase: string) => {
  if (!phrase) return false
  return ` ${prompt} `.includes(` ${phrase} `)
}

export const scoreItem = (
  item: RegistryItem,
  prompt: string,
  options: { framework?: FrameworkId; mobile?: boolean }
): ScoreResult => {
  const expanded = normalize(expandPrompt(prompt))
  const name = normalize(item.name)
  const description = normalize(item.description || '')
  const tags = getTags(item).map(normalize)
  const category = normalize(getMetaString(item, 'category') || item.categories?.[0] || '')
  const reasons: string[] = []
  let score = 0

  if (includesPhrase(expanded, name)) {
    score += 12
    reasons.push(`name:${item.name}`)
  } else if (
    name
      .split(' ')
      .filter((token) => token.length > 2)
      .every((token) => includesPhrase(expanded, token)) &&
    name.split(' ').some((token) => token.length > 2)
  ) {
    score += 8
    reasons.push(`name-tokens:${item.name}`)
  }

  const promptTokens = expanded
    .split(' ')
    .filter((token) => token.length > 2 && !stopwords.has(token))
  if (description && promptTokens.some((token) => description.split(' ').includes(token))) {
    score += 4
    reasons.push('description')
  }

  tags.forEach((tag) => {
    if (tag && includesPhrase(expanded, tag)) {
      score += 5
      reasons.push(`tag:${tag}`)
    }
  })

  if (category && includesPhrase(expanded, category)) {
    score += 3
    reasons.push(`category:${category}`)
  }

  if (score === 0) return { score: 0, reasons: [] }

  if (options.mobile) {
    const viewport = getMetaString(item, 'viewport') || ''
    if (tags.includes('mobile') || viewport.includes('mobile')) {
      score += 6
      reasons.push('mobile')
    }
  }

  if (item.type === 'registry:page') score += 3
  if (item.type === 'registry:block') score += 2

  if (options.framework && getFrameworks(item).includes(options.framework)) {
    score += 4
    reasons.push(`framework:${options.framework}`)
  }

  return { score, reasons }
}
