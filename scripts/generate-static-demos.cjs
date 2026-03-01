const fs = require('fs')
const path = require('path')

const targets = [
  'apps/docs/registry/default/components/checkbox',
  'apps/docs/registry/default/components/dialog',
  'apps/docs/registry/default/components/dropdown',
  'apps/docs/registry/default/components/input',
  'apps/docs/registry/default/components/pagination',
  'apps/docs/registry/default/components/popover',
  'apps/docs/registry/default/components/radio',
  'apps/docs/registry/default/components/select',
  'apps/docs/registry/default/components/navbar',
  'apps/docs/registry/default/components/notification',
  'apps/docs/registry/default/components/event-calendar',
  'apps/docs/registry/default/components/file-upload',
  'apps/docs/registry/default/components/image-cropper',
]

const moduleMap = {
  Checkbox: 'checkbox',
  CheckboxTree: 'checkbox-tree',
  Label: 'label',
  Button: 'button',
  Input: 'input',
  Textarea: 'textarea',
  Dialog: 'dialog',
  DialogTrigger: 'dialog',
  DialogContent: 'dialog',
  DialogHeader: 'dialog',
  DialogTitle: 'dialog',
  DialogDescription: 'dialog',
  DialogFooter: 'dialog',
  DialogClose: 'dialog',
  AlertDialog: 'alert-dialog',
  AlertDialogTrigger: 'alert-dialog',
  AlertDialogContent: 'alert-dialog',
  AlertDialogHeader: 'alert-dialog',
  AlertDialogTitle: 'alert-dialog',
  AlertDialogDescription: 'alert-dialog',
  AlertDialogFooter: 'alert-dialog',
  AlertDialogAction: 'alert-dialog',
  AlertDialogCancel: 'alert-dialog',
  DropdownMenu: 'dropdown-menu',
  DropdownMenuTrigger: 'dropdown-menu',
  DropdownMenuContent: 'dropdown-menu',
  DropdownMenuItem: 'dropdown-menu',
  DropdownMenuLabel: 'dropdown-menu',
  DropdownMenuSeparator: 'dropdown-menu',
  DropdownMenuGroup: 'dropdown-menu',
  DropdownMenuRadioGroup: 'dropdown-menu',
  DropdownMenuRadioItem: 'dropdown-menu',
  DropdownMenuCheckboxItem: 'dropdown-menu',
  DropdownMenuSub: 'dropdown-menu',
  DropdownMenuSubTrigger: 'dropdown-menu',
  DropdownMenuSubContent: 'dropdown-menu',
  DropdownMenuShortcut: 'dropdown-menu',
  Popover: 'popover',
  PopoverTrigger: 'popover',
  PopoverContent: 'popover',
  PopoverAnchor: 'popover',
  NavigationMenu: 'navigation-menu',
  NavigationMenuList: 'navigation-menu',
  NavigationMenuItem: 'navigation-menu',
  NavigationMenuLink: 'navigation-menu',
  NavigationMenuTrigger: 'navigation-menu',
  NavigationMenuContent: 'navigation-menu',
  NavigationMenuViewport: 'navigation-menu',
  NavigationMenuIndicator: 'navigation-menu',
  Tooltip: 'tooltip',
  TooltipProvider: 'tooltip',
  TooltipTrigger: 'tooltip',
  TooltipContent: 'tooltip',
  RadioGroup: 'radio-group',
  RadioGroupItem: 'radio-group',
  Pagination: 'pagination',
  PaginationContent: 'pagination',
  PaginationItem: 'pagination',
  PaginationLink: 'pagination',
  PaginationNext: 'pagination',
  PaginationPrevious: 'pagination',
  PaginationEllipsis: 'pagination',
  Select: 'select',
  SelectTrigger: 'select',
  SelectValue: 'select',
  SelectContent: 'select',
  SelectItem: 'select',
  SelectGroup: 'select',
  SelectLabel: 'select',
  SelectSeparator: 'select',
  SelectScrollUpButton: 'select',
  SelectScrollDownButton: 'select',
  SelectNative: 'select-native',
  Separator: 'separator',
  Avatar: 'avatar',
  AvatarImage: 'avatar',
  AvatarFallback: 'avatar',
  Card: 'card',
  CardHeader: 'card',
  CardContent: 'card',
  CardFooter: 'card',
  CardTitle: 'card',
  CardDescription: 'card',
}

const skipImport = new Set([
  'EventCalendar',
  'Cropper',
  'CropperImage',
  'CropperCropArea',
  'CropperDescription',
  'Logo',
  'NotificationMenu',
  'UserMenu',
  'InfoMenu',
  'SettingsMenu',
  'ThemeToggle',
  'TeamSwitcher',
  'AppToggle',
  'Filters',
  'DatePicker',
])

const iconSvg = (className) => {
  const cls = className ? ` class=\"${className}\"` : ' class=\"size-4 opacity-60\"'
  return ` <svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"${cls}><circle cx=\"12\" cy=\"12\" r=\"9\" /></svg>`
}

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\./g, '-')
    .toLowerCase()

const extractReturnJSX = (code) => {
  const exportIndex = code.indexOf('export default function')
  const fallbackIndex = code.indexOf('function Component')
  const startIndex = exportIndex !== -1 ? exportIndex : fallbackIndex
  let bodyStart = startIndex !== -1 ? code.indexOf('{', startIndex) : -1
  if (bodyStart === -1) bodyStart = code.indexOf('{')
  if (bodyStart === -1) {
    const idx = code.indexOf('return (')
    if (idx === -1) return ''
    return code.slice(idx + 'return ('.length)
  }

  let depth = 1
  let quote = null
  let inLineComment = false
  let inBlockComment = false
  for (let i = bodyStart + 1; i < code.length; i += 1) {
    const ch = code[i]
    const next = code[i + 1]
    const prev = code[i - 1]

    if (inLineComment) {
      if (ch === '\n') inLineComment = false
      continue
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false
        i += 1
      }
      continue
    }
    if (!quote && ch === '/' && next === '/') {
      inLineComment = true
      i += 1
      continue
    }
    if (!quote && ch === '/' && next === '*') {
      inBlockComment = true
      i += 1
      continue
    }
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      continue
    }

    if (ch === '{') depth += 1
    if (ch === '}') depth -= 1

    if (depth === 1 && code.startsWith('return (', i)) {
      let j = i + 'return ('.length
      let parenDepth = 1
      let out = ''
      while (j < code.length) {
        const cur = code[j]
        if (cur === '(') parenDepth += 1
        if (cur === ')') parenDepth -= 1
        if (parenDepth === 0) break
        out += cur
        j += 1
      }
      return out.trim()
    }
  }
  return ''
}

const stripComments = (input) => input.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

const stripFragments = (input) =>
  input.replace(/<>/g, '').replace(/<\/>/g, '').replace(/<Fragment[^>]*>/g, '').replace(/<\/Fragment>/g, '')

const resolveConditionals = (input) => {
  const unwrapParens = (value) => {
    const trimmed = value.trim()
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      return trimmed.slice(1, -1).trim()
    }
    return trimmed
  }

  const parseConditional = (block) => {
    let depthParen = 0
    let depthBrace = 0
    let depthBracket = 0
    let quote = null
    let qIndex = -1
    let cIndex = -1

    for (let i = 0; i < block.length; i += 1) {
      const ch = block[i]
      const prev = block[i - 1]
      if (quote) {
        if (ch === quote && prev !== '\\') quote = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch
        continue
      }
      if (ch === '(') depthParen += 1
      if (ch === ')') depthParen -= 1
      if (ch === '{') depthBrace += 1
      if (ch === '}') depthBrace -= 1
      if (ch === '[') depthBracket += 1
      if (ch === ']') depthBracket -= 1

      const atTop = depthParen === 0 && depthBrace === 0 && depthBracket === 0
      if (atTop && ch === '?' && qIndex === -1) qIndex = i
      if (atTop && ch === ':' && qIndex !== -1) {
        cIndex = i
        break
      }
    }

    if (qIndex !== -1 && cIndex !== -1) {
      const condition = block.slice(0, qIndex).trim()
      if (condition === 'true') {
        return unwrapParens(block.slice(qIndex + 1, cIndex))
      }
      if (condition === 'false') {
        return unwrapParens(block.slice(cIndex + 1))
      }
      const equalityMatch = condition.match(/^['"]?([^'"]+)['"]?\s*===\s*['"]?([^'"]+)['"]?$/)
      if (equalityMatch) {
        const left = equalityMatch[1].trim()
        const right = equalityMatch[2].trim()
        if (left === right) {
          return unwrapParens(block.slice(qIndex + 1, cIndex))
        }
        return unwrapParens(block.slice(cIndex + 1))
      }
      const elseBranch = block.slice(cIndex + 1)
      return unwrapParens(elseBranch)
    }

    // Handle logical && at top level by dropping the block.
    depthParen = 0
    depthBrace = 0
    depthBracket = 0
    quote = null
    for (let i = 0; i < block.length - 1; i += 1) {
      const ch = block[i]
      const next = block[i + 1]
      const prev = block[i - 1]
      if (quote) {
        if (ch === quote && prev !== '\\') quote = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch
        continue
      }
      if (ch === '(') depthParen += 1
      if (ch === ')') depthParen -= 1
      if (ch === '{') depthBrace += 1
      if (ch === '}') depthBrace -= 1
      if (ch === '[') depthBracket += 1
      if (ch === ']') depthBracket -= 1
      const atTop = depthParen === 0 && depthBrace === 0 && depthBracket === 0
      if (atTop && ch === '&' && next === '&') return ''
    }

    return null
  }

  let out = ''
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]
    if (ch !== '{') {
      out += ch
      continue
    }
    let depth = 1
    let j = i + 1
    let quote = null
    for (; j < input.length; j += 1) {
      const cur = input[j]
      const prev = input[j - 1]
      if (quote) {
        if (cur === quote && prev !== '\\') quote = null
        continue
      }
      if (cur === '"' || cur === "'" || cur === '`') {
        quote = cur
        continue
      }
      if (cur === '{') depth += 1
      if (cur === '}') depth -= 1
      if (depth === 0) break
    }
    const block = input.slice(i + 1, j)
    const resolved = parseConditional(block)
    if (resolved !== null) {
      out += resolved
    } else {
      out += `{${block}}`
    }
    i = j
  }
  return out
}

const replaceIcons = (input) => {
  const replaceWithSvg = (_m, _name, attrs) => {
    const classMatch = attrs.match(/className=\"([^\"]+)\"|className=\{\"([^\"]+)\"\}/)
    const className = classMatch ? classMatch[1] || classMatch[2] : ''
    return iconSvg(className)
  }
  return input
    .replace(/<([A-Za-z0-9_.]*Icon)([\s\S]*?)\/>/g, replaceWithSvg)
    .replace(/<(Ri[A-Za-z0-9_]+)([\s\S]*?)\/>/g, replaceWithSvg)
}

const extractConstNumber = (code, name) => {
  const match = code.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\d+)`))
  return match ? Number(match[1]) : null
}

const extractMaxSizeMB = (code) => {
  const direct = extractConstNumber(code, 'maxSizeMB')
  if (direct !== null) return direct
  const fromMaxSize = code.match(/const\s+maxSize\s*=\s*(\d+)\s*\*\s*1024\s*\*\s*1024/)
  if (fromMaxSize) return Number(fromMaxSize[1])
  return null
}

const staticTimezones = [
  { value: 'Europe/London', label: '(GMT+0) Europe/London', numericOffset: 0 },
  { value: 'America/New_York', label: '(GMT-4) America/New York', numericOffset: -4 },
  { value: 'Asia/Shanghai', label: '(GMT+8) Asia/Shanghai', numericOffset: 8 },
]

const replaceNumericTokens = (markup, values) => {
  let out = markup
  if (values.maxSizeMB !== null) {
    const maxSizeText = String(values.maxSizeMB)
    out = out.replace(/\{\s*maxSizeMB\s*\}/g, maxSizeText)
    out = out.replace(/\{\s*maxSize\s*\}/g, maxSizeText)
    out = out.replace(/\{\s*formatBytes\(\s*maxSize\s*\)\s*\}/g, `${maxSizeText}MB`)
  }
  if (values.maxFiles !== null) {
    out = out.replace(/\{\s*maxFiles\s*\}/g, String(values.maxFiles))
  }
  return out
}

const sanitizeArray = (input) =>
  input
    .replace(/Icon:\s*[A-Za-z0-9_]+/g, 'Icon: "icon"')
    .replace(/icon:\s*[A-Za-z0-9_]+/g, 'icon: "icon"')
    .replace(/\n/g, ' ')

const evalArray = (arrSource) => {
  try {
    const cleaned = sanitizeArray(arrSource)
    return Function(`"use strict"; return (${cleaned});`)()
  } catch (err) {
    return null
  }
}

const findClosingBrace = (input, startIndex) => {
  let depth = 0
  let quote = null
  for (let i = startIndex; i < input.length; i += 1) {
    const ch = input[i]
    const prev = input[i - 1]
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      continue
    }
    if (ch === '{') depth += 1
    if (ch === '}') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

const extractMapBlock = (expression, arrowIndex) => {
  const afterArrow = expression.slice(arrowIndex + 2).trim()
  let blockStart = -1
  if (afterArrow.startsWith('{')) {
    const returnIndex = expression.indexOf('return', arrowIndex)
    if (returnIndex === -1) return null
    blockStart = expression.indexOf('(', returnIndex)
  } else {
    blockStart = expression.indexOf('(', arrowIndex)
  }
  if (blockStart === -1) return null
  let i = blockStart + 1
  let depth = 1
  let block = ''
  while (i < expression.length) {
    const ch = expression[i]
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) break
    block += ch
    i += 1
  }
  return block
}

const renderMapItems = (block, items, varName, destructuredKeys, expandNested) =>
  items
    .map((item) => {
      let chunk = block
      if (typeof item === 'string' || typeof item === 'number') {
        const safeValue = String(item)
        chunk = chunk.replace(new RegExp(`\\s+key=\\{\\s*${varName}\\s*\\}`, 'g'), '')
        chunk = chunk.replace(new RegExp(`\\$\\{\\s*${varName}\\s*\\}`, 'g'), safeValue)
        const varOnly = new RegExp(`\\{\\s*${varName}\\s*\\}`, 'g')
        chunk = chunk.replace(varOnly, safeValue)
        chunk = chunk.replace(new RegExp(`value=\\{\\s*${varName}\\s*\\}`, 'g'), `value="${safeValue}"`)
        chunk = chunk.replace(new RegExp(`${varName}\\.toLocaleString\\(\\)`, 'g'), safeValue)
        const pluralPattern = new RegExp(`\\{\\s*${varName}\\s*===\\s*['"]1['"]\\s*\\?\\s*''\\s*:\\s*'s'\\s*\\}`, 'g')
        chunk = chunk.replace(pluralPattern, safeValue === '1' ? '' : 's')
      }
      const entries = Object.entries(item || {})
      entries.forEach(([key, value]) => {
        if (key === 'icon') return
        if (typeof value === 'string' || typeof value === 'number') {
          const safeValue = String(value)
          chunk = chunk.replace(new RegExp(`\\s+key=\\{\\s*${varName}\\.${key}\\s*\\}`, 'g'), '')
          if (key === 'value') {
            chunk = chunk.replace(new RegExp(`value=\\{\\s*${varName}\\.${key}\\s*\\}`, 'g'), `value="${safeValue}"`)
          }
          chunk = chunk.replace(new RegExp(`\\$\\{\\s*${varName}\\.${key}\\s*\\}`, 'g'), safeValue)
          const varRef = new RegExp(`\\{\\s*${varName}\\.${key}\\s*\\}`, 'g')
          chunk = chunk.replace(varRef, safeValue)
          chunk = chunk.replace(new RegExp(`${varName}\\.${key}\\.toLocaleString\\(\\)`, 'g'), safeValue)
          chunk = chunk.replace(new RegExp(`${varName}\\.${key}`, 'g'), safeValue)
        }
        if (typeof value === 'boolean') {
          chunk = chunk.replace(new RegExp(`${varName}\\.${key}`, 'g'), value ? 'true' : 'false')
        }
      })
      destructuredKeys.forEach((key) => {
        const value = item && item[key]
        if (value === undefined) return
        const safeValue = String(value)
        chunk = chunk.replace(new RegExp(`\\{\\s*${key}\\s*\\}`, 'g'), safeValue)
        chunk = chunk.replace(new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g'), safeValue)
      })
      chunk = chunk.replace(new RegExp(`<${varName}\\.icon[^>]*\\/?>`, 'g'), iconSvg('opacity-60'))
      chunk = chunk.replace(new RegExp(`<${varName}\\.Icon[^>]*\\/?>`, 'g'), iconSvg('opacity-60'))
      chunk = chunk.replace(/<Icon[^>]*\/>/g, iconSvg('opacity-60'))
      if (Array.isArray(item.items)) {
        chunk = expandNested(chunk, `${varName}.items`, item.items)
      }
      return chunk
    })
    .join('\n')

const expandNamedMap = (markup, listName, items) => {
  if (!items) return markup
  let out = markup
  while (true) {
    const mapStart = out.indexOf(`{${listName}.map(`)
    if (mapStart === -1) break
    const blockEnd = findClosingBrace(out, mapStart)
    if (blockEnd === -1) break
    const before = out.slice(0, mapStart)
    const after = out.slice(blockEnd + 1)
    const expression = out.slice(mapStart + 1, blockEnd)
    const paramsMatch = expression.match(/map\(\(([\s\S]*?)\)\s*=>/)
    const params = paramsMatch ? paramsMatch[1].trim() : 'item'
    const destructuredMatch = params.startsWith('{') ? params : null
    const varMatch = params.match(/^[A-Za-z0-9_]+$/)
    const varName = varMatch ? varMatch[0] : 'item'
    let destructuredKeys = []
    if (destructuredMatch) {
      const inner = destructuredMatch.replace(/[{}]/g, '').trim()
      destructuredKeys = inner
        .split(',')
        .map((part) => part.split(':')[0].trim())
        .filter(Boolean)
    }
    const arrowIndex = expression.indexOf('=>')
    if (arrowIndex === -1) break
    const block = extractMapBlock(expression, arrowIndex)
    if (!block) break
    const rendered = renderMapItems(block, items, varName, destructuredKeys, expandNamedMap)
    out = before + rendered + after
  }
  return out
}

const expandInlineArrayMap = (markup) => {
  let out = markup
  let cursor = 0
  while (true) {
    const mapStart = out.indexOf('{[', cursor)
    if (mapStart === -1) break
    const blockEnd = findClosingBrace(out, mapStart)
    if (blockEnd === -1) break
    const expression = out.slice(mapStart + 1, blockEnd)
    const mapIndex = expression.indexOf('.map(')
    if (mapIndex === -1) {
      cursor = mapStart + 1
      continue
    }
    const arrayLiteral = expression.slice(0, mapIndex).trim()
    if (!arrayLiteral.startsWith('[')) {
      cursor = mapStart + 1
      continue
    }
    let items = null
    try {
      items = evalArray(arrayLiteral)
    } catch (_err) {
      items = null
    }
    if (!items) {
      cursor = mapStart + 1
      continue
    }
    const paramsMatch = expression.match(/map\(\s*\(?\s*([A-Za-z0-9_{}\s,:]+)\s*\)?\s*=>/)
    const params = paramsMatch ? paramsMatch[1].trim() : 'item'
    const destructuredMatch = params.startsWith('{') ? params : null
    const varMatch = params.match(/^[A-Za-z0-9_]+$/)
    const varName = varMatch ? varMatch[0] : 'item'
    let destructuredKeys = []
    if (destructuredMatch) {
      const inner = destructuredMatch.replace(/[{}]/g, '').trim()
      destructuredKeys = inner
        .split(',')
        .map((part) => part.split(':')[0].trim())
        .filter(Boolean)
    }
    const arrowIndex = expression.indexOf('=>')
    if (arrowIndex === -1) {
      cursor = mapStart + 1
      continue
    }
    const block = extractMapBlock(expression, arrowIndex)
    if (!block) {
      cursor = mapStart + 1
      continue
    }
    const before = out.slice(0, mapStart)
    const after = out.slice(blockEnd + 1)
    const rendered = renderMapItems(block, items, varName, destructuredKeys, expandNamedMap)
    out = before + rendered + after
    cursor = before.length + rendered.length
  }
  return out
}

const expandItemsMap = (markup, items, baseId) => {
  const mapStart = markup.indexOf('{items.map(')
  if (mapStart === -1 || !items) return markup
  const before = markup.slice(0, mapStart)
  const afterStart = markup.indexOf('=>', mapStart)
  const blockStart = markup.indexOf('(', afterStart)
  let i = blockStart + 1
  let depth = 1
  let block = ''
  while (i < markup.length) {
    const ch = markup[i]
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) break
    block += ch
    i += 1
  }
  const rest = markup.slice(i + 3)
  const rendered = items
    .map((item) => {
      let chunk = block
      chunk = chunk.replace(/\{\s*item\.label\[0\]\s*\}/g, (item.label || '')[0] || '')
      chunk = chunk.replace(/\{\s*item\.label\s*\}/g, item.label || '')
      chunk = chunk.replace(/\{\s*item\.value\s*\}/g, item.value || '')
      chunk = chunk.replace(/item\.value/g, item.value || '')
      chunk = chunk.replace(/item\.defaultChecked/g, item.defaultChecked ? 'true' : 'false')
      chunk = chunk.replace(/item\.disabled/g, item.disabled ? 'true' : 'false')
      if (baseId && item.value !== undefined) {
        chunk = chunk.replace(/htmlFor=\{`[^`]*`\}/g, `for=\"${baseId}-${item.value}\"`)
        chunk = chunk.replace(/for=\{`[^`]*`\}/g, `for=\"${baseId}-${item.value}\"`)
        chunk = chunk.replace(/id=\{`[^`]*`\}/g, `id=\"${baseId}-${item.value}\"`)
      }
      chunk = chunk.replace(/<item\.Icon[^>]*\/>/g, iconSvg('opacity-60'))
      return chunk
    })
    .join('\n')
  return before + rendered + rest
}

const expandEmailsMap = (markup, emails, baseId) => {
  const mapStart = markup.indexOf('{emails.map(')
  if (mapStart === -1 || !emails) return markup
  const before = markup.slice(0, mapStart)
  const afterStart = markup.indexOf('=>', mapStart)
  const blockStart = markup.indexOf('(', afterStart)
  let i = blockStart + 1
  let depth = 1
  let block = ''
  while (i < markup.length) {
    const ch = markup[i]
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) break
    block += ch
    i += 1
  }
  const rest = markup.slice(i + 3)
  const rendered = emails
    .map((email, index) => {
      let chunk = block
      chunk = chunk.replace(/index \+ 1/g, String(index + 1))
      chunk = chunk.replace(/index/g, String(index))
      if (baseId) {
        chunk = chunk.replace(/id=\{`[^`]*`\}/g, `id="${baseId}-${index + 1}"`)
      }
      chunk = chunk.replace(/value=\{email\}/g, `value="${email}"`)
      chunk = chunk.replace(/\{\s*email\s*\}/g, email)
      return chunk
    })
    .join('\n')
  return before + rendered + rest
}

const expandNumberMap = (markup) => {
  const match = markup.match(/\{\s*\[([^\]]+)\]\.map\(\(number\)\s*=>\s*\(/)
  if (!match) return markup
  const numbers = evalArray('[' + match[1] + ']')
  if (!Array.isArray(numbers)) return markup
  const mapStart = markup.indexOf(match[0])
  const before = markup.slice(0, mapStart)
  const afterStart = markup.indexOf('=>', mapStart)
  const blockStart = markup.indexOf('(', afterStart)
  let i = blockStart + 1
  let depth = 1
  let block = ''
  while (i < markup.length) {
    const ch = markup[i]
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) break
    block += ch
    i += 1
  }
  const rest = markup.slice(i + 3)
  const rendered = numbers
    .map((num) =>
      block.replace(/\{\s*number\s*\}/g, String(num)).replace(/number/g, String(num))
    )
    .join('\n')
  return before + rendered + rest
}

const expandSlotsMap = (markup) => {
  const mapStart = markup.indexOf('{slots.map(')
  if (mapStart === -1) return markup
  const before = markup.slice(0, mapStart)
  const afterStart = markup.indexOf('=>', mapStart)
  const blockStart = markup.indexOf('(', afterStart)
  let i = blockStart + 1
  let depth = 1
  let block = ''
  while (i < markup.length) {
    const ch = markup[i]
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) break
    block += ch
    i += 1
  }
  const rest = markup.slice(i + 3)
  const rendered = new Array(4)
    .fill(0)
    .map(() =>
      block.replace(
        /<Slot[^>]*\/>/g,
        '<div className="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs"></div>'
      )
    )
    .join('\n')
  return before + rendered + rest
}

const expandSlotsSliceMap = (markup) => {
  let out = markup
  const sliceRegex = /\{slots\.slice\((\d+)(?:,\s*(\d+))?\)\.map\(\(slot[^)]*\)\s*=>\s*\(/
  while (true) {
    const match = out.match(sliceRegex)
    if (!match) break
    const [full, start, end] = match
    const mapStart = out.indexOf(full)
    const before = out.slice(0, mapStart)
    const afterStart = out.indexOf('=>', mapStart)
    const blockStart = out.indexOf('(', afterStart)
    let i = blockStart + 1
    let depth = 1
    let block = ''
    while (i < out.length) {
      const ch = out[i]
      if (ch === '(') depth += 1
      if (ch === ')') depth -= 1
      if (depth === 0) break
      block += ch
      i += 1
    }
    const rest = out.slice(i + 3)
    const sliceCount = end ? Number(end) - Number(start) : 3
    const rendered = new Array(sliceCount)
      .fill(0)
      .map(() =>
        block.replace(
          /<Slot[^>]*\/>/g,
          '<div className="border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs"></div>'
        )
      )
      .join('\n')
    out = before + rendered + rest
  }
  return out
}

const applyInput47Static = () => `
  <div className="*:not-first:mt-2" dir="ltr">
    <Label>Phone number input</Label>
    <div className="border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px]">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="text-muted-foreground/80">
          ${iconSvg('size-4 opacity-60')}
        </span>
      </div>
      <select className="absolute inset-0 text-sm opacity-0" aria-label="Select country">
        <option value="">Select a country</option>
        <option value="US">United States +1</option>
        <option value="FR">France +33</option>
        <option value="JP">Japan +81</option>
      </select>
    </div>
    <Input data-slot="phone-input" className="-ms-px rounded-s-none shadow-none focus-visible:z-10" />
    <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with
      <a
        className="hover:text-foreground underline"
        href="https://gitlab.com/catamphetamine/react-phone-number-input"
        target="_blank"
        rel="noopener nofollow"
      >
        react-phone-number-input
      </a>
    </p>
  </div>
`

const applyInput52Static = () => `
  <div>
    <div className="*:not-first:mt-2">
      <Label>Input with password strength indicator</Label>
      <div className="relative">
        <Input className="pe-9" placeholder="Password" type="password" />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          aria-label="Show password"
          aria-pressed="false"
          aria-controls="password"
        >
          ${iconSvg('size-4 opacity-60')}
        </button>
      </div>
    </div>
    <div
      className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-valuenow="2"
      aria-valuemin="0"
      aria-valuemax="4"
      aria-label="Password strength"
    >
      <div className="h-full bg-orange-500 transition-all duration-500 ease-out" style="width: 50%"></div>
    </div>
    <p className="text-foreground mb-2 text-sm font-medium">
      Weak password. Must contain:
    </p>
    <ul className="space-y-1.5" aria-label="Password requirements">
      <li className="flex items-center gap-2">
        ${iconSvg('size-4 text-muted-foreground/80')}
        <span className="text-xs text-muted-foreground">At least 8 characters</span>
      </li>
      <li className="flex items-center gap-2">
        ${iconSvg('size-4 text-muted-foreground/80')}
        <span className="text-xs text-muted-foreground">At least 1 number</span>
      </li>
      <li className="flex items-center gap-2">
        ${iconSvg('size-4 text-muted-foreground/80')}
        <span className="text-xs text-muted-foreground">At least 1 lowercase letter</span>
      </li>
      <li className="flex items-center gap-2">
        ${iconSvg('size-4 text-muted-foreground/80')}
        <span className="text-xs text-muted-foreground">At least 1 uppercase letter</span>
      </li>
    </ul>
  </div>
`

const applyNavbar02Static = () => `
  <header className="border-b px-4 md:px-6">
    <div className="flex h-16 items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <a href="#" className="text-primary hover:text-primary/90">
          <Logo />
        </a>
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
                active
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
              >
                Features
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                href="#"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="text-sm">
          <a href="#">Sign In</a>
        </Button>
        <Button asChild size="sm" className="text-sm">
          <a href="#">Get Started</a>
        </Button>
      </div>
    </div>
  </header>
`

const expandStepDots = (markup, totalSteps) => {
  if (!totalSteps) return markup
  const mapStart = markup.indexOf('{[...Array(totalSteps)].map')
  if (mapStart === -1) return markup
  const before = markup.slice(0, mapStart)
  const afterStart = markup.indexOf('=>', mapStart)
  const blockStart = markup.indexOf('(', afterStart)
  let i = blockStart + 1
  let depth = 1
  let block = ''
  while (i < markup.length) {
    const ch = markup[i]
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) break
    block += ch
    i += 1
  }
  const rest = markup.slice(i + 3)
  const rendered = new Array(totalSteps).fill(0).map((_, idx) => {
    let chunk = block
    const classMatch = chunk.match(/className=\{cn\([^\)]*\)\}/)
    if (classMatch) {
      const className = idx === 0 ? 'bg-primary size-1.5 rounded-full' : 'bg-primary size-1.5 rounded-full opacity-20'
      chunk = chunk.replace(classMatch[0], `className=\"${className}\"`)
    }
    chunk = chunk.replace(/index \+ 1/g, String(idx + 1))
    return chunk
  }).join('\n')
  return before + rendered + rest
}

const applyDialog12Static = () => {
  const otpSlots =
    '<div className=\"flex gap-2\">' +
    new Array(4)
      .fill(0)
      .map(
        () =>
          '<div className=\"border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs\"></div>'
      )
      .join('') +
    '</div>'

  return `
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">OTP code</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Enter confirmation code</DialogTitle>
            <DialogDescription className="sm:text-center">
              Check your email and enter the code - Try 6548
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            ${otpSlots}
          </div>
          <p className="text-center text-sm">
            <a className="underline hover:no-underline" href="#">
              Resend code
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  `
}

const applyDialog20Static = (markup, stepContent) => {
  if (!stepContent || !stepContent.length) return markup
  const first = stepContent[0]
  let out = markup
  out = out.replace(/\{stepContent\[step - 1\]\.title\}/g, first.title)
  out = out.replace(/\{stepContent\[step - 1\]\.description\}/g, first.description)
  out = out.replace(/\{step < totalSteps \? \(([\s\S]*?)\) : \(([\s\S]*?)\)\}/g, '$1')
  out = expandStepDots(out, stepContent.length)
  return out
}

const applyCheckbox18Static = () => `
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-18-id-1" />
      <Label for="checkbox-18-id-1">Natural Wonders</Label>
    </div>
    <div className="ms-6 space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-18-id-2" checked />
        <Label for="checkbox-18-id-2">Mountains</Label>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Checkbox id="checkbox-18-id-3" />
          <Label for="checkbox-18-id-3">Waterfalls</Label>
        </div>
        <div className="ms-6 space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-18-id-4" />
            <Label for="checkbox-18-id-4">Niagara Falls</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-18-id-5" checked />
            <Label for="checkbox-18-id-5">Angel Falls</Label>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-18-id-6" />
        <Label for="checkbox-18-id-6">Grand Canyon</Label>
      </div>
    </div>
  </div>
`

const applyDialog16Static = () => `
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Card details</Button>
    </DialogTrigger>
    <DialogContent>
      <div className="flex flex-col gap-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          ${iconSvg('opacity-80')}
        </div>
        <DialogHeader>
          <DialogTitle className="text-left">Update your card</DialogTitle>
          <DialogDescription className="text-left">
            Your new card will replace your current card.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form className="space-y-5">
        <div className="space-y-4">
          <div className="*:not-first:mt-2">
            <Label for="name-dialog-16-id">Name on card</Label>
            <Input id="name-dialog-16-id" type="text" required />
          </div>
          <div className="*:not-first:mt-2">
            <Label for="number-dialog-16-id">Card Number</Label>
            <div className="relative">
              <Input id="number-dialog-16-id" className="peer pe-9 [direction:inherit]" />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                ${iconSvg('size-4 opacity-60')}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label for="expiry-dialog-16-id">Expiry date</Label>
              <Input className="[direction:inherit]" id="expiry-dialog-16-id" />
            </div>
            <div className="flex-1 space-y-2">
              <Label for="cvc-dialog-16-id">CVC</Label>
              <Input className="[direction:inherit]" id="cvc-dialog-16-id" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="primary-dialog-16-id" />
          <Label for="primary-dialog-16-id" className="text-muted-foreground font-normal">
            Set as default payment method
          </Label>
        </div>
        <Button type="button" className="w-full">
          Update card
        </Button>
      </form>
    </DialogContent>
  </Dialog>
`

const applyDialog17Static = () => `
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Checkout</Button>
    </DialogTrigger>
    <DialogContent>
      <div className="mb-2 flex flex-col gap-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          ${iconSvg('opacity-80')}
        </div>
        <DialogHeader>
          <DialogTitle className="text-left">Confirm and pay</DialogTitle>
          <DialogDescription className="text-left">
            Pay securely and cancel object time.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form className="space-y-5">
        <div className="space-y-4">
          <RadioGroup className="grid-cols-2" defaultValue="yearly">
            <label className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id="radio-monthly" value="monthly" className="sr-only after:absolute after:inset-0" />
              <p className="text-foreground text-sm font-medium">Monthly</p>
              <p className="text-muted-foreground text-sm">$32/month</p>
            </label>
            <label className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id="radio-yearly" value="yearly" className="sr-only after:absolute after:inset-0" />
              <div className="inline-flex items-start justify-between gap-2">
                <p className="text-foreground text-sm font-medium">Yearly</p>
                <Badge>Popular</Badge>
              </div>
              <p className="text-muted-foreground text-sm">$320/month</p>
            </label>
          </RadioGroup>
          <div className="*:not-first:mt-2">
            <Label for="name-dialog-17-id">Name on card</Label>
            <Input id="name-dialog-17-id" type="text" required />
          </div>
          <div className="*:not-first:mt-2">
            <legend className="text-foreground text-sm font-medium">Card Details</legend>
            <div className="rounded-md shadow-xs">
              <div className="relative focus-within:z-10">
                <Input className="peer rounded-b-none pe-9 shadow-none [direction:inherit]" />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                  ${iconSvg('size-4 opacity-60')}
                </div>
              </div>
              <div className="-mt-px flex">
                <div className="min-w-0 flex-1 focus-within:z-10">
                  <Input className="rounded-e-none rounded-t-none shadow-none [direction:inherit]" />
                </div>
                <div className="-ms-px min-w-0 flex-1 focus-within:z-10">
                  <Input className="rounded-s-none rounded-t-none shadow-none [direction:inherit]" />
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="text-sm underline hover:no-underline">
            + Add coupon
          </button>
        </div>
        <Button type="button" className="w-full">
          Subscribe
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-xs">
        Payments are non-refundable. Cancel anytime.
      </p>
    </DialogContent>
  </Dialog>
`

const normalizeAttributes = (markup, baseId) => {
  let out = markup
  out = out.replace(/\s+on[A-Z][A-Za-z]+\s*=\s*\{[\s\S]*?\}\s*/g, ' ')
  out = out.replace(/\s+ref\=\{[^}]*\}/g, '')
  out = out.replace(/\s+key\=\{[^}]*\}/g, '')
  out = out.replace(/\s+\{\.\.\.[^}]*\}/g, '')
  out = out.replace(/htmlFor=/g, 'for=')
  out = out.replace(/className=/g, 'class=')
  out = out.replace(/\basChild=/g, 'as-child=')
  out = out.replace(/\bsideOffset=/g, 'side-offset=')
  out = out.replace(/\bcloseOnSelect=/g, 'close-on-select=')
  out = out.replace(/\bdefaultChecked\b/g, 'checked')
  out = out.replace(/\bdefaultOpen\b/g, 'open')

  out = out.replace(/(\s+[\w:-]+)=\{([^}]+)\}/g, (_m, attr, value) => {
    const trimmed = value.trim()
    const name = attr.trim()
    if (name.startsWith('on')) return ''
    if (name === 'id' || name === 'for' || name === 'htmlFor') return ` ${name}="${baseId}"`
    if (trimmed === 'true') return ` ${name}`
    if (trimmed === 'false') return ''
    if (/^\d+$/.test(trimmed)) return ` ${name}="${trimmed}"`
    const strMatch = trimmed.match(/^['"`]{1}([\s\S]*)['"`]{1}$/)
    if (strMatch) {
      const content = strMatch[1].replace(/\$\{[^}]+\}/g, baseId)
      return ` ${name}="${content}"`
    }
    if (name === 'checked' && /indeterminate/.test(trimmed)) return ' checked="indeterminate"'
    return ''
  })

  out = out.replace(/\{\s*'\s*'\s*\}/g, ' ')
  out = out.replace(/\{\s*\"\s*\"\s*\}/g, ' ')
  out = out.replace(/\{\s*`\s*`\s*\}/g, ' ')
  out = out.replace(/<([A-Za-z0-9-]+)\}/g, '<$1')
  out = out.replace(/\}\s*>/g, '>')
  out = out.replace(/\}\s*(?=[a-z-]+=)/gi, ' ')
  out = out.replace(/\{([^}]+)\}/g, (_m, expr) => {
    const trimmed = expr.trim()
    const strMatch = trimmed.match(/^['"`]{1}([\s\S]*)['"`]{1}$/)
    if (strMatch) {
      return strMatch[1].replace(/\$\{[^}]+\}/g, baseId)
    }
    if (/^\d+$/.test(trimmed)) return trimmed
    return ''
  })

  return out
}

const replaceTemplateLiterals = (markup, baseId) =>
  markup.replace(/`([^`]+)`/g, (_m, inner) => {
    const content = inner.replace(/\$\{[^}]+\}/g, baseId)
    return `\"${content}\"`
  })

const extractComponents = (markup) => {
  const set = new Set()
  const regex = /<([A-Z][A-Za-z0-9]*)/g
  let match
  while ((match = regex.exec(markup))) {
    const name = match[1]
    if (name.endsWith('Icon')) continue
    if (name === 'Slot') continue
    set.add(name)
  }
  return Array.from(set)
}

const buildImports = (components) => {
  const moduleGroups = {}
  components.filter((comp) => !skipImport.has(comp)).forEach((comp) => {
    const mod = moduleMap[comp] || kebab(comp)
    moduleGroups[mod] = moduleGroups[mod] || []
    moduleGroups[mod].push(comp)
  })
  return Object.entries(moduleGroups)
    .map(([mod, comps]) => {
      const unique = Array.from(new Set(comps)).sort()
      return `import { ${unique.join(', ')} } from '@/components/ui/${mod}'`
    })
    .join('\n')
}

const toVue = (markup) => {
  const components = extractComponents(markup)
  const imports = components.length ? buildImports(components) : ''
  return [
    imports ? `<script setup lang="ts">\n${imports}\n</script>\n` : '<script setup lang="ts"></script>\n',
    '<template>\n',
    markup.trim(),
    '\n</template>\n',
  ].join('')
}

const toHtmlOrWxml = (markup, tags) => {
  let out = markup
  tags.forEach((tag) => {
    const lower = kebab(tag)
    out = out.replace(new RegExp(`<${tag}(\\s|>)`, 'g'), `<${lower}$1`)
    out = out.replace(new RegExp(`</${tag}>`, 'g'), `</${lower}>`)
  })
  return out
}

const processFile = (filePath) => {
  const code = fs.readFileSync(filePath, 'utf8')
  const baseName = path.basename(filePath, '.tsx')
  let markup = extractReturnJSX(code)
  if (!markup) return

  markup = stripComments(markup)
  markup = stripFragments(markup)
  markup = replaceIcons(markup)

  const values = {
    maxSizeMB: extractMaxSizeMB(code),
    maxFiles: extractConstNumber(code, 'maxFiles'),
  }

  markup = replaceNumericTokens(markup, values)

  const baseId = baseName + '-id'

  if (baseName === 'checkbox-18') {
    markup = applyCheckbox18Static()
  }

  if (baseName === 'input-47') {
    markup = applyInput47Static()
  }

  if (baseName === 'input-52') {
    markup = applyInput52Static()
  }

  if (baseName === 'navbar-02') {
    markup = applyNavbar02Static()
  }

  if (baseName === 'checkbox-17' || baseName === 'checkbox-19') {
    const itemsMatch = code.match(/const items = \[([\s\S]*?)\]/)
    const items = itemsMatch ? evalArray('[' + itemsMatch[1] + ']') : null
    markup = expandItemsMap(markup, items, baseId)
  }

  if (baseName === 'dialog-11') {
    markup = expandNumberMap(markup)
  }

  if (baseName === 'dialog-12') {
    markup = applyDialog12Static()
  }

  if (baseName === 'dialog-16') {
    markup = applyDialog16Static()
  }

  if (baseName === 'dialog-17') {
    markup = applyDialog17Static()
  }

  if (baseName === 'dialog-15') {
    const emailsMatch = code.match(/useState\((\[[\s\S]*?\])\)/)
    const emails = emailsMatch ? evalArray(emailsMatch[1]) : null
    markup = expandEmailsMap(markup, emails, baseId)
  }

  if (baseName === 'dialog-20') {
    const stepMatch = code.match(/const stepContent = \[([\s\S]*?)\]\n/)
    const stepContent = stepMatch ? evalArray('[' + stepMatch[1] + ']') : null
    markup = applyDialog20Static(markup, stepContent)
  }

  if (markup.includes('{navigationLinks.map')) {
    const linksMatch = code.match(/const navigationLinks = \[([\s\S]*?)\]/)
    const links = linksMatch ? evalArray('[' + linksMatch[1] + ']') : null
    markup = expandNamedMap(markup, 'navigationLinks', links)
  }

  if (markup.includes('{links.map')) {
    const linksMatch = code.match(/const links = \[([\s\S]*?)\]/)
    const links = linksMatch ? evalArray('[' + linksMatch[1] + ']') : null
    markup = expandNamedMap(markup, 'links', links)
  }

  if (markup.includes('{languages.map')) {
    const languagesMatch = code.match(/const languages = \[([\s\S]*?)\]/)
    const languages = languagesMatch ? evalArray('[' + languagesMatch[1] + ']') : null
    markup = expandNamedMap(markup, 'languages', languages)
  }

  if (markup.includes('Array.from({ length: totalPages') || markup.includes('Array.from({length: totalPages')) {
    markup = markup.replace(
      /Array\.from\(\{\s*length:\s*totalPages\s*\},\s*\(_,\s*i\)\s*=>\s*i\s*\+\s*1\s*\)/g,
      'pages'
    )
  }

  if (markup.includes('{pages.map')) {
    markup = expandNamedMap(markup, 'pages', [1, 2, 3, 4, 5])
  }

  if (markup.includes('{notifications.map')) {
    const notificationsMatch = code.match(/const initialNotifications = \[([\s\S]*?)\]/)
    const notifications = notificationsMatch ? evalArray('[' + notificationsMatch[1] + ']') : null
    markup = expandNamedMap(markup, 'notifications', notifications)
  }

  if (markup.includes('{formattedTimezones.map')) {
    markup = expandNamedMap(markup, 'formattedTimezones', staticTimezones)
  }

  const arrayMatches = code.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*\[([\s\S]*?)\]\s*\n/g)
  for (const match of arrayMatches) {
    const name = match[1]
    if (!name || name === 'navigationLinks' || name === 'links' || name === 'languages') continue
    if (markup.includes(`{${name}.map`)) {
      const items = evalArray('[' + match[2] + ']')
      markup = expandNamedMap(markup, name, items)
    }
  }

  if (markup.includes('{value.map')) {
    const tagsMatch = code.match(/const defaultTags = \[([\s\S]*?)\]/)
    const tags = tagsMatch ? evalArray('[' + tagsMatch[1] + ']') : null
    markup = expandNamedMap(markup, 'value', tags)
  }

  markup = expandInlineArrayMap(markup)
  markup = expandSlotsSliceMap(markup)

  markup = resolveConditionals(markup)

  markup = replaceTemplateLiterals(markup, baseId)
  markup = normalizeAttributes(markup, baseId)
  const components = extractComponents(markup)

  const vue = toVue(markup)
  const html = toHtmlOrWxml(markup, components)
  const wxml = toHtmlOrWxml(markup, components).replace(/<div/g, '<view').replace(/<\/div>/g, '</view>')

  fs.writeFileSync(filePath.replace(/\.tsx$/, '.vue'), vue)
  fs.writeFileSync(filePath.replace(/\.tsx$/, '.html'), html)
  fs.writeFileSync(filePath.replace(/\.tsx$/, '.wxml'), wxml)
}

for (const dir of targets) {
  const full = path.join(process.cwd(), dir)
  const files = fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.tsx'))
    .filter((f) => /-\d+\.tsx$/.test(f) || f === 'event-calendar-01.tsx')
  files.forEach((f) => processFile(path.join(full, f)))
}

console.log('Static demo generation complete.')
