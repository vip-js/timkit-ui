import type { RegistryItem } from '@timui/core'

type TitleReason = 'explicit' | 'heading' | 'heuristic' | 'pattern'

type TitleResult = {
  title: string
  reason: TitleReason
}

const toTitleCase = (value: string): string =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const normalizePhrase = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const expanded = trimmed.replace(/^w\//i, 'With ').replace(/\s+/g, ' ')
  return expanded.charAt(0).toUpperCase() + expanded.slice(1)
}

const extractHeading = (source: string): string | null => {
  const match = source.match(/<h[1-6][^>]*>\s*([^<\n]{2,90})\s*<\/h[1-6]>/i)
  if (!match) return null
  return normalizePhrase(match[1])
}

const extractAriaLabel = (source: string): string | null => {
  const match = source.match(/aria-label=["'`]([^"'`]{2,90})["'`]/i)
  if (!match) return null
  return normalizePhrase(match[1])
}

const extractLabelText = (source: string): string | null => {
  const match = source.match(/<Label[^>]*>\s*([^<\n]{2,90})\s*<\/Label>/i)
  if (!match) return null
  return normalizePhrase(match[1])
}

const getSources = (files: RegistryItem['files'] = []): string[] =>
  files
    .filter((file) => /\.(tsx|jsx|vue|html|wxml)$/.test(file.path))
    .map((file) => file.content || '')
    .filter(Boolean)

const getPrimarySource = (files: RegistryItem['files'] = []): string => getSources(files)[0] || ''

const getSemanticFromHeading = (files: RegistryItem['files'] = []): string | null => {
  const sources = getSources(files)
  for (const source of sources) {
    const heading = extractHeading(source)
    if (heading) return heading
  }
  return null
}

const countToken = (source: string, token: RegExp): number => {
  const matched = source.match(token)
  return matched ? matched.length : 0
}

const inferGenericDescriptor = (source: string): string | null => {
  const rules: Array<[RegExp, string]> = [
    [/onClose|dismiss|close/i, 'Dismissible'],
    [/loading|spinner|isLoading/i, 'Loading State'],
    [/disabled|aria-disabled/i, 'Disabled State'],
    [/hover|focus-visible|active/i, 'Interactive State'],
    [/tooltip|popover|dialog|sheet/i, 'Overlay Pattern'],
    [/search|filter/i, 'Search Pattern'],
    [/pagination|pageSize|page/i, 'Paging Pattern'],
    [/icon|Icon/i, 'With icon'],
    [/avatar|image|fallback/i, 'Profile Pattern'],
    [/destructive|danger|error/i, 'Destructive Variant'],
    [/warning|amber|yellow/i, 'Warning Variant'],
    [/success|green/i, 'Success Variant'],
    [/info|blue|cyan/i, 'Info Variant'],
    [/outline|border/i, 'Outlined Style'],
  ]

  for (const [matcher, label] of rules) {
    if (matcher.test(source)) return label
  }

  return null
}

const inferComponentSpecificDescriptor = (
  componentSlug: string,
  source: string,
  demoName: string
): string | null => {
  if (
    componentSlug === 'input' ||
    componentSlug === 'select' ||
    componentSlug === 'radio' ||
    componentSlug === 'checkbox'
  ) {
    if (/Label/i.test(source)) return 'With label'
    if (/required|asterisk/i.test(source)) return 'Required field'
    if (/error|invalid|danger|destructive/i.test(source)) return 'Error state'
    if (/helper|hint|description|assistive/i.test(source)) return 'With helper text'
    if (/disabled|aria-disabled/i.test(source)) return 'Disabled state'
    if (/search|filter/i.test(source)) return 'Search pattern'
    if (/Icon|icon/i.test(source)) return 'With icon'
  }

  if (componentSlug === 'button') {
    if (
      /^\s*import\s+\{\s*Button\s*\}/m.test(source) &&
      /return\s*<Button>[^<]+<\/Button>/m.test(source)
    ) {
      return 'Basic button'
    }
    if (/rounded-full/i.test(source)) return 'Rounded button'
    if (/loading|spinner|isLoading/i.test(source)) return 'Loading state'
    if (/Icon|icon/i.test(source)) return 'With icon'
    if (/outline|border/i.test(source)) return 'Outlined variant'
    if (/destructive|danger|error/i.test(source)) return 'Destructive variant'
    if (/ghost|link/i.test(source)) return 'Low emphasis variant'
  }

  if (componentSlug === 'slider') {
    const ariaLabel = extractAriaLabel(source)
    if (ariaLabel) return ariaLabel
    const labelText = extractLabelText(source)
    if (labelText) return labelText
    if (/range|dual|min|max/i.test(source)) return 'Range slider'
    if (/marks|ticks|step/i.test(source)) return 'Stepped slider'
    if (/disabled|aria-disabled/i.test(source)) return 'Disabled state'
    if (/input|number/i.test(source)) return 'With numeric input'
  }

  if (componentSlug === 'switch') {
    if (/label|description/i.test(source)) return 'With label'
    if (/disabled|aria-disabled/i.test(source)) return 'Disabled state'
    if (/icon|Icon/i.test(source)) return 'With icon'
  }

  if (componentSlug === 'stepper') {
    if (/StepperTitle/i.test(source)) return 'With step titles'
    if (/asChild/i.test(source)) return 'Numeric indicators'
    if (/StepperIndicator\s*\/>/i.test(source)) return 'Dot indicators'
    if (/vertical/i.test(source)) return 'Vertical layout'
    if (/icon|Icon/i.test(source)) return 'With step icon'
    if (/description/i.test(source)) return 'With descriptions'
  }

  if (componentSlug === 'tabs') {
    if (/defaultValue=.*tab-1/i.test(source)) return 'Basic tabs'
    if (/vertical/i.test(source)) return 'Vertical tabs'
    if (/icon|Icon/i.test(source)) return 'With tab icons'
    if (/underline|border-b/i.test(source)) return 'Underline style'
  }

  if (componentSlug === 'avatar') {
    const avatarCount = countToken(source, /<Avatar[\s>]/g)
    if (avatarCount >= 3) return 'Avatar group'
    if (/AvatarImage/i.test(source) && /AvatarFallback/i.test(source)) return 'Image + fallback'
    if (/AvatarFallback/i.test(source)) return 'Fallback only'
  }

  if (componentSlug === 'badge') {
    if (
      /^\s*import\s+\{\s*Badge\s*\}/m.test(source) &&
      /return\s*<Badge>[^<]+<\/Badge>/m.test(source)
    ) {
      return 'Basic badge'
    }
    if (/rounded-full|rounded\b/i.test(source)) return 'Rounded badge'
    if (/href=|asChild/i.test(source)) return 'Link badge'
    if (/Icon|icon/i.test(source)) return 'With icon'
    if (/<svg[\s>]/i.test(source)) return 'With icon'
    if (/>\s*\d+\s*<\/Badge>/i.test(source)) return 'Counter badge'
    if (/text-\[0\.625rem\]|font-medium/i.test(source)) return 'With secondary value'
    if (/outline|border/i.test(source)) return 'Outlined style'
  }

  if (componentSlug === 'alert' || componentSlug === 'notification' || componentSlug === 'banner') {
    if (/onClose|dismiss|close/i.test(source)) return 'Dismissible'
    if (/success|green/i.test(source)) return 'Success variant'
    if (/warning|amber|yellow/i.test(source)) return 'Warning variant'
    if (/destructive|danger|error|red/i.test(source)) return 'Destructive variant'
    if (/info|blue|cyan/i.test(source)) return 'Info variant'
  }

  if (componentSlug === 'accordion') {
    if (/PlusIcon|plus-minus/i.test(source)) return 'With plus-minus icon'
    if (/Chevron|chevron/i.test(source)) return 'With chevron'
    if (/icon/i.test(source)) return 'With leading icon'
  }

  if (componentSlug === 'textarea') {
    const labelText = extractLabelText(source)
    if (labelText) return labelText
    if (/readOnly/i.test(source)) return 'Read-only textarea'
    if (/field-sizing-content|autogrow/i.test(source)) return 'Autogrowing textarea'
    if (/resize:none|\[resize:none\]/i.test(source)) return 'No-resize textarea'
  }

  if (componentSlug === 'timeline') {
    if (/TimelineContent/i.test(source) && /description/i.test(source)) return 'Detailed timeline'
    if (/TimelineContent/i.test(source)) return 'Timeline with content'
    if (/TimelineDate/i.test(source)) return 'Timeline with dates'
    return 'Project timeline'
  }

  return null
}

const inferSemanticFromSource = (
  componentSlug: string,
  demoName: string,
  files: RegistryItem['files'] = []
): string | null => {
  const source = getPrimarySource(files)
  if (!source) return null

  const heading = extractHeading(source)
  if (heading) return heading

  const specific = inferComponentSpecificDescriptor(componentSlug, source, demoName)
  if (specific) return specific

  const labelText = extractLabelText(source)
  if (labelText) return labelText

  const ariaLabel = extractAriaLabel(source)
  if (ariaLabel) return ariaLabel

  return inferGenericDescriptor(source)
}

export const resolveDemoDisplayTitleDetail = (
  componentSlug: string,
  demoName: string,
  files: RegistryItem['files'] = [],
  explicitTitle?: string
): TitleResult => {
  const componentTitle = toTitleCase(componentSlug)

  if (explicitTitle?.trim()) {
    return {
      title: explicitTitle.trim(),
      reason: 'explicit',
    }
  }

  const headingTitle = getSemanticFromHeading(files)
  if (headingTitle) {
    return {
      title: `${componentTitle} · ${headingTitle}`,
      reason: 'heading',
    }
  }

  const heuristicTitle = inferSemanticFromSource(componentSlug, demoName, files)
  if (heuristicTitle) {
    return {
      title: `${componentTitle} · ${heuristicTitle}`,
      reason: 'heuristic',
    }
  }

  const suffixMatch = demoName.match(/-(\d{1,3})$/)
  if (suffixMatch) {
    const index = suffixMatch[1].padStart(2, '0')
    return {
      title: `${componentTitle} · Pattern ${index}`,
      reason: 'pattern',
    }
  }

  return {
    title: `${componentTitle} · ${toTitleCase(demoName)}`,
    reason: 'pattern',
  }
}

export const resolveDemoDisplayTitle = (
  componentSlug: string,
  demoName: string,
  files: RegistryItem['files'] = [],
  explicitTitle?: string
): string => resolveDemoDisplayTitleDetail(componentSlug, demoName, files, explicitTitle).title
