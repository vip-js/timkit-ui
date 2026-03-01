const fs = require('fs')
const path = require('path')
const vm = require('vm')

const { buildChevronSvg, buildPlusSvg } = require('./icon-templates.cjs')

const ROOT = path.resolve(__dirname, '..')
const COMPONENT_DIR = path.join(ROOT, 'apps/docs/registry/default/components/accordion')
const HTML_DIR = path.join(ROOT, 'apps/docs/registry/default/html')

const scenes = Array.from({ length: 20 }, (_, index) =>
  `accordion-${String(index + 1).padStart(2, '0')}`
)

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const sanitizeItemsBlock = (block) =>
  block
    .replace(/icon\s*:\s*([A-Za-z0-9_]+)/g, 'icon: "$1"')
    .replace(/,\s*}/g, '}')

const parseItems = (tsxContent) => {
  const match = tsxContent.match(
    /const\s+items\s*=\s*\[([\s\S]*?)\]\s*(?:;|(?=export)|(?=\n))/
  )
  if (!match) {
    return []
  }
  const sanitized = sanitizeItemsBlock(match[1])
  const script = `items = [${sanitized}];`
  const sandbox = {}
  vm.createContext(sandbox)
  vm.runInContext(script, sandbox)
  return sandbox.items
}

const parseTitle = (tsxContent, fallback) => {
  const match = tsxContent.match(/<h2[^>]*>([^<]+)<\/h2>/)
  if (match) return match[1].trim()
  return fallback
}

const extractClass = (tsxContent, componentName) => {
  const match = tsxContent.match(new RegExp(`<${componentName}[^>]*className="([^"]*)"`, 'm'))
  return match ? match[1] : ''
}

const extractElement = (tsxContent, componentName) => {
  const match = tsxContent.match(
    new RegExp(`<${componentName}[\\s\\S]*?<\\/${componentName}>`)
  )
  return match ? match[0] : ''
}

const mapIconName = (iconName) => {
  if (!iconName) return iconName
  return iconName
}

const serializeValue = (value, options, depth = 0) => {
  const indent = '  '.repeat(depth)
  const nextIndent = '  '.repeat(depth + 1)

  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `[\n${value
      .map((item) => `${nextIndent}${serializeValue(item, options, depth + 1)}`)
      .join(',\n')}\n${indent}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(([key, val]) => {
      if (key === 'icon' && typeof val === 'string' && options.iconAsComponent) {
        return `${nextIndent}${key}: ${options.iconMapper(val)}`
      }
      return `${nextIndent}${key}: ${serializeValue(val, options, depth + 1)}`
    })
    if (!entries.length) return '{}'
    return `{\n${entries.join(',\n')}\n${indent}}`
  }

  if (typeof value === 'string') return JSON.stringify(value)
  return String(value)
}

const stringifyItems = (items, options) => serializeValue(items, options)

const addIconLabels = (items) =>
  items.map((item) => {
    const base = { ...item }
    if (base.icon) {
      base.iconLabel = iconLabelFor(base.icon)
    }
    if (Array.isArray(base.collapsibles)) {
      base.collapsibles = base.collapsibles.map((collapsible) => {
        const nested = { ...collapsible }
        if (nested.icon) {
          nested.iconLabel = iconLabelFor(nested.icon)
        }
        return nested
      })
    }
    return base
  })

const iconLabelFor = (iconName) => {
  const map = {
    AtSignIcon: '@',
    BellIcon: 'Bell',
    CircleDashedIcon: 'Dash',
    CommandIcon: 'Cmd',
    EclipseIcon: 'Ecl',
    GaugeIcon: 'Gauge',
    LifeBuoyIcon: 'Help',
    Link2Icon: 'Link',
    ShieldCheckIcon: 'Safe',
    ZapIcon: 'Zap',
  }
  if (map[iconName]) return map[iconName]
  return iconName.replace(/Icon$/, '').slice(0, 3)
}

const buildMeta = (tsxContent, items) => {
  const accordionClass = extractClass(tsxContent, 'Accordion') || 'w-full'
  const itemClass = extractClass(tsxContent, 'AccordionItem') || 'py-2'
  const triggerClass =
    extractClass(tsxContent, 'AccordionTrigger') ||
    'py-2 text-[15px] leading-6 hover:no-underline'
  const contentClass =
    extractClass(tsxContent, 'AccordionContent') || 'text-muted-foreground pb-2'
  const triggerElement = extractElement(tsxContent, 'AccordionTrigger')
  const hasTriggerWrapper = /<div className="flex">\s*<AccordionTrigger/.test(tsxContent)
  const hasSub = items.some((item) => item.sub)
  const hasIcon = items.some((item) => item.icon)
  const hasCollapsibles = items.some((item) => item.collapsibles)
  const usesPlusIcon = triggerElement.includes('PlusIcon')
  const usesChevronDownIcon = triggerElement.includes('ChevronDownIcon')
  const iconOnLeft = triggerClass.includes('[&>svg]:-order-1')
  const collapsibleClass = extractClass(tsxContent, 'Collapsible')
  const collapsibleTriggerClass = extractClass(tsxContent, 'CollapsibleTrigger')
  const collapsibleContentClass = extractClass(tsxContent, 'CollapsibleContent')

  return {
    accordionClass,
    itemClass,
    triggerClass,
    contentClass,
    hasTriggerWrapper,
    hasSub,
    hasIcon,
    hasCollapsibles,
    usesPlusIcon,
    usesChevronDownIcon,
    iconOnLeft,
    collapsibleClass,
    collapsibleTriggerClass,
    collapsibleContentClass,
  }
}

const collectIcons = (items, triggerIcon, target) => {
  const icons = new Set()
  const addIcon = (name) => {
    if (!name) return
    icons.add(mapIconName(name, target))
  }
  if (triggerIcon === 'plus') addIcon('PlusIcon')
  if (triggerIcon === 'chevron') addIcon('ChevronDownIcon')
  items.forEach((item) => {
    if (item.icon) addIcon(item.icon)
    if (Array.isArray(item.collapsibles)) {
      item.collapsibles.forEach((collapsible) => {
        if (collapsible.icon) addIcon(collapsible.icon)
      })
    }
  })
  return Array.from(icons)
}

const buildTriggerIcon = (meta) => {
  if (meta.usesPlusIcon) return 'plus'
  if (meta.usesChevronDownIcon) return 'chevron'
  return null
}

const buildTriggerInnerVue = (meta) => {
  if (meta.hasIcon && meta.hasSub) {
    return `<span class="flex items-center gap-3">
                <span
                  class="flex size-10 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <component :is="item.icon" :size="16" class="opacity-60" />
                </span>
                <span class="flex flex-col space-y-1">
                  <span>{{ item.title }}</span>
                  <span v-if="item.sub" class="text-sm font-normal">{{ item.sub }}</span>
                </span>
              </span>`
  }
  if (meta.hasIcon) {
    return `<span class="flex items-center gap-3">
                <component :is="item.icon" :size="16" class="shrink-0 opacity-60" aria-hidden="true" />
                <span>{{ item.title }}</span>
              </span>`
  }
  if (meta.hasSub) {
    return `<span class="flex flex-col space-y-1">
                <span>{{ item.title }}</span>
                <span v-if="item.sub" class="text-sm font-normal">{{ item.sub }}</span>
              </span>`
  }
  return '{{ item.title }}'
}

const buildTriggerIconSlotVue = (iconType) => {
  if (iconType === 'plus') {
    return `<template #icon>
            <PlusIcon class="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200" />
          </template>`
  }
  if (iconType === 'chevron') {
    return `<template #icon>
            <ChevronDownIcon
              class="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200"
            />
          </template>`
  }
  return ''
}

const buildTriggerIconSlotSvelte = (iconType) => {
  if (iconType === 'plus') {
    return `<Plus slot="icon" class="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200" />`
  }
  if (iconType === 'chevron') {
    return `<ChevronDown slot="icon" class="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200" />`
  }
  return ''
}


const buildTriggerIconHtml = (iconType, isOpen) => {
  if (iconType === 'plus') {
    return buildPlusSvg({ dataAttr: 'accordion-icon', isOpen })
  }
  return buildChevronSvg({ dataAttr: 'accordion-icon', isOpen })
}

const buildCollapsibleIconHtml = (isOpen) =>
  buildChevronSvg({ dataAttr: 'collapsible-icon', isOpen, className: 'mt-1' })

const buildTriggerIconWeapp = (iconType) => {
  if (iconType === 'plus') {
    return `<text class="text-sm font-semibold">+</text>`
  }
  return `<text class="text-sm font-semibold">v</text>`
}

const writeVue = (name, title, items, meta) => {
  const triggerIcon = buildTriggerIcon(meta)
  const needsCollapsible = meta.hasCollapsibles
  const icons = new Set(collectIcons(items, triggerIcon, 'vue'))
  if (needsCollapsible) {
    icons.add(mapIconName('ChevronDownIcon', 'vue'))
  }
  const iconList = Array.from(icons)

  const imports = [
    `import {`,
    `  Accordion,`,
    `  AccordionContent,`,
    `  AccordionItem,`,
    `  AccordionTrigger,`,
    `} from '@/components/ui/accordion'`,
  ]

  if (needsCollapsible) {
    imports.push(
      `import {`,
      `  Collapsible,`,
      `  CollapsibleContent,`,
      `  CollapsibleTrigger,`,
      `} from '@/components/ui/collapsible'`
    )
  }

  if (iconList.length) {
    imports.push(`import { ${iconList.join(', ')} } from 'lucide-vue-next'`)
  }

  const itemsScript = stringifyItems(items, {
    iconAsComponent: true,
    iconMapper: (icon) => mapIconName(icon, 'vue'),
  })

  const triggerInner = buildTriggerInnerVue(meta)
  const triggerIconSlot = buildTriggerIconSlotVue(triggerIcon)
  const triggerWrapperOpen = meta.hasTriggerWrapper ? '        <div class="flex">\n' : ''
  const triggerWrapperClose = meta.hasTriggerWrapper ? '        </div>\n' : ''

  const collapsibleBlock = meta.hasCollapsibles
    ? `        <AccordionContent class="${meta.contentClass}">
          <Collapsible
            v-for="(collapsible, index) in item.collapsibles"
            :key="index"
            class="${meta.collapsibleClass}"
            :default-open="collapsible.open"
          >
            <CollapsibleTrigger class="${meta.collapsibleTriggerClass}">
              <ChevronDownIcon
                class="mt-1 shrink-0 opacity-60 transition-transform duration-200"
              />
              ${items.some((item) => item.collapsibles?.some((c) => c.icon))
                ? `<span class="flex items-center gap-3">
                <component :is="collapsible.icon" :size="16" class="shrink-0 opacity-60" aria-hidden="true" />
                <span>{{ collapsible.title }}</span>
              </span>`
                : `{{ collapsible.title }}`}
            </CollapsibleTrigger>
            <CollapsibleContent class="${meta.collapsibleContentClass}">
              {{ collapsible.content }}
            </CollapsibleContent>
          </Collapsible>
        </AccordionContent>`
    : `        <AccordionContent class="${meta.contentClass}">
          {{ item.content }}
        </AccordionContent>`

  const content = `<script setup lang="ts">
${imports.join('\n')}

const items = ${itemsScript}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">${title}</h2>
    <Accordion type="single" collapsible class="${meta.accordionClass}" default-value="3">
      <AccordionItem
        v-for="item in items"
        :key="item.id"
        :value="item.id"
        class="${meta.itemClass}"
      >
${triggerWrapperOpen}        <AccordionTrigger class="${meta.triggerClass}">
          ${triggerInner}
${triggerIconSlot ? `          ${triggerIconSlot}` : ''}
        </AccordionTrigger>
${triggerWrapperClose}${collapsibleBlock}
      </AccordionItem>
    </Accordion>
  </div>
</template>
`

  fs.writeFileSync(path.join(COMPONENT_DIR, `${name}.vue`), content, 'utf-8')
}

const buildHtmlItemLabel = (item, meta) => {
  if (meta.hasIcon && meta.hasSub) {
    return `<span class="flex items-center gap-3">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full border text-xs uppercase">
          ${item.iconLabel || ''}
        </span>
        <span class="flex flex-col space-y-1">
          <span>${item.title}</span>
          ${item.sub ? `<span class="text-sm font-normal">${item.sub}</span>` : ''}
        </span>
      </span>`
  }
  if (meta.hasIcon) {
    return `<span class="flex items-center gap-3">
        <span class="text-[10px] uppercase opacity-60">${item.iconLabel || ''}</span>
        <span>${item.title}</span>
      </span>`
  }
  if (meta.hasSub) {
    return `<span class="flex flex-col space-y-1">
        <span>${item.title}</span>
        ${item.sub ? `<span class="text-sm font-normal">${item.sub}</span>` : ''}
      </span>`
  }
  return item.title
}

const DEFAULT_OPEN_VALUE = '3'

const writeHtml = (name, title, items, meta) => {
  const triggerIcon = buildTriggerIcon(meta)
  const iconLabelItems = addIconLabels(items)
  const entries = iconLabelItems
    .map((item) => {
      const isOpen = item.id === DEFAULT_OPEN_VALUE
      const triggerLabel = buildHtmlItemLabel(item, meta)
      const content = meta.hasCollapsibles
        ? `<div data-collapsible-root>
            ${item.collapsibles
              .map((collapsible) => {
              const isNestedOpen = !!collapsible.open
              const nestedLabel = collapsible.iconLabel
                ? `<span class="flex items-center gap-3">
                    <span class="text-[10px] uppercase opacity-60">${collapsible.iconLabel}</span>
                    <span>${collapsible.title}</span>
                  </span>`
                : collapsible.title
              return `<div class="${meta.collapsibleClass}">
                <button
                  class="${meta.collapsibleTriggerClass}"
                  type="button"
                  data-collapsible-trigger
                  aria-expanded="${isNestedOpen ? 'true' : 'false'}"
                >
                  ${buildCollapsibleIconHtml(isNestedOpen)}
                  ${nestedLabel}
                </button>
                <div
                  class="${meta.collapsibleContentClass}"
                  data-collapsible-content
                  data-state="${isNestedOpen ? 'open' : 'closed'}"
                  style="${isNestedOpen ? '' : 'height: 0; overflow: hidden;'}"
                >
                  ${collapsible.content}
                </div>
              </div>`
              })
              .join('')}
          </div>`
        : item.content

      const iconMarkup = buildTriggerIconHtml(triggerIcon, isOpen)
      const triggerContent = meta.iconOnLeft
        ? `${iconMarkup}
      ${triggerLabel}`
        : `${triggerLabel}
      ${iconMarkup}`

      return `
  <div class="${meta.itemClass}" data-accordion-item data-value="${item.id}" data-state="${isOpen ? 'open' : 'closed'}">
    <button class="${meta.triggerClass}" type="button" data-accordion-trigger aria-expanded="${isOpen ? 'true' : 'false'}">
      ${triggerContent}
    </button>
    <div
      class="${meta.contentClass}"
      data-accordion-content
      data-state="${isOpen ? 'open' : 'closed'}"
      style="${isOpen ? '' : 'height: 0; overflow: hidden; padding-bottom: 0;'}"
    >
      ${content}
    </div>
  </div>`
    })
    .join('')

  const script = `<script>
(() => {
  const setOpen = (item, open) => {
    item.dataset.state = open ? 'open' : 'closed';
    const content = item.querySelector('[data-accordion-content]');
    if (content) {
      content.dataset.state = open ? 'open' : 'closed';
      content.style.height = open ? '' : '0';
      content.style.overflow = open ? '' : 'hidden';
      if (!open) {
        content.style.paddingBottom = '0';
      } else {
        content.style.paddingBottom = '';
      }
    }
    const trigger = item.querySelector('[data-accordion-trigger]');
    if (trigger) {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
        const icon = item.querySelector('[data-accordion-icon]');
        if (icon) {
          const type = icon.dataset.iconType;
          if (type === 'plus') {
            const vertical = icon.querySelector('[data-plus-vertical]');
            if (vertical) vertical.style.opacity = open ? '0' : '1';
          } else if (type === 'chevron') {
            icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        }
  };

  const roots = document.querySelectorAll('[data-accordion-root]');
  roots.forEach((root) => {
    const items = Array.from(root.querySelectorAll('[data-accordion-item]'));
    items.forEach((item) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = item.dataset.state === 'open';
        items.forEach((other) => setOpen(other, false));
        if (!isOpen) setOpen(item, true);
      });
    });
  });

  const collapsibleRoots = document.querySelectorAll('[data-collapsible-root]');
  collapsibleRoots.forEach((root) => {
    const triggers = root.querySelectorAll('[data-collapsible-trigger]');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const content = trigger.parentElement?.querySelector('[data-collapsible-content]');
        if (!content) return;
        const isOpen = content.dataset.state === 'open';
        content.dataset.state = isOpen ? 'closed' : 'open';
        content.style.height = isOpen ? '0' : '';
        content.style.overflow = isOpen ? 'hidden' : '';
        trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        const icon = trigger.querySelector('[data-collapsible-icon]');
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    });
  });
})();
</script>`

  const content = `<section class="space-y-4">
  <h2 class="text-xl font-bold">${title}</h2>
  <div class="${meta.accordionClass}" data-accordion-root>
    ${entries}
  </div>
</section>
${script}`

  fs.writeFileSync(path.join(HTML_DIR, `${name}.html`), content, 'utf-8')
}

const buildWeappTriggerLabel = (meta) => {
  if (meta.hasIcon && meta.hasSub) {
    return `<view class="flex items-center gap-3">
            <view class="flex size-10 shrink-0 items-center justify-center rounded-full border text-xs uppercase">
              {{item.iconLabel}}
            </view>
            <view class="flex flex-col space-y-1">
              <text>{{item.title}}</text>
              <text wx:if="{{item.sub}}" class="text-sm font-normal">{{item.sub}}</text>
            </view>
          </view>`
  }
  if (meta.hasIcon) {
    return `<view class="flex items-center gap-3">
            <text class="text-[10px] uppercase opacity-60">{{item.iconLabel}}</text>
            <text>{{item.title}}</text>
          </view>`
  }
  if (meta.hasSub) {
    return `<view class="flex flex-col space-y-1">
            <text>{{item.title}}</text>
            <text wx:if="{{item.sub}}" class="text-sm font-normal">{{item.sub}}</text>
          </view>`
  }
  return `{{item.title}}`
}

const writeWeapp = (name, title, items, meta) => {
  const triggerIcon = buildTriggerIcon(meta)
  const iconLabelItems = addIconLabels(items)
  const triggerLabel = buildWeappTriggerLabel(meta)

  const nestedBlock = meta.hasCollapsibles
    ? `<view slot="content" class="${meta.contentClass}">
          <block
            wx:for="{{item.collapsibles}}"
            wx:key="index"
            wx:for-index="collapsibleIndex"
            wx:for-item="collapsible"
          >
            <view class="${meta.collapsibleClass}">
              <view
                class="${meta.collapsibleTriggerClass}"
                data-item-index="{{itemIndex}}"
                data-collapsible-index="{{collapsibleIndex}}"
                bindtap="toggleCollapsible"
              >
                <text class="mt-1 shrink-0 opacity-60">v</text>
                <block wx:if="{{collapsible.iconLabel}}">
                  <view class="flex items-center gap-3">
                    <text class="text-[10px] uppercase opacity-60">{{collapsible.iconLabel}}</text>
                    <text>{{collapsible.title}}</text>
                  </view>
                </block>
                <block wx:else>
                  <text>{{collapsible.title}}</text>
                </block>
              </view>
              <view class="${meta.collapsibleContentClass}" wx:if="{{collapsible.open}}">
                {{collapsible.content}}
              </view>
            </view>
          </block>
        </view>`
    : `<view slot="content" class="${meta.contentClass}">{{item.content}}</view>`

  const iconSlot = triggerIcon
    ? `        <view slot="icon" class="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200">
          ${buildTriggerIconWeapp(triggerIcon)}
        </view>`
    : ''

  const wxml = `<view class="space-y-4">
  <view class="text-xl font-bold">${title}</view>
  <accordion type="single" collapsible class="${meta.accordionClass}" bind:change="handleValueChange" value="{{value}}">
    <block wx:for="{{items}}" wx:key="id" wx:for-index="itemIndex" wx:for-item="item">
      <accordion-item value="{{item.id}}" class="${meta.itemClass}">
        <view slot="trigger" class="${meta.triggerClass}">
          ${triggerLabel}
        </view>
${iconSlot}
${nestedBlock}
      </accordion-item>
    </block>
  </accordion>
</view>`

  const data = JSON.stringify(
    {
      component: true,
      usingComponents: {
        accordion: '../../ui/accordion',
        'accordion-item': '../../ui/accordion-item/index',
      },
    },
    null,
    2
  )

  const ts = `Component({
  data: {
    value: "3",
    items: ${JSON.stringify(iconLabelItems, null, 2)}
  },
  methods: {
    handleValueChange(e) {
      this.setData({ value: e.detail.value })
    },
    toggleCollapsible(e) {
      const itemIndex = e.currentTarget.dataset.itemIndex
      const collapsibleIndex = e.currentTarget.dataset.collapsibleIndex
      const items = this.data.items.slice()
      const collapsible = items[itemIndex]?.collapsibles?.[collapsibleIndex]
      if (!collapsible) return
      collapsible.open = !collapsible.open
      this.setData({ items })
    }
  }
})`

  fs.writeFileSync(path.join(COMPONENT_DIR, `${name}.wxml`), wxml, 'utf-8')
  fs.writeFileSync(path.join(COMPONENT_DIR, `${name}.json`), data, 'utf-8')
  fs.writeFileSync(path.join(COMPONENT_DIR, `${name}.js`), ts, 'utf-8')
}

ensureDir(COMPONENT_DIR)
ensureDir(HTML_DIR)

scenes.forEach((name) => {
  const tsxPath = path.join(COMPONENT_DIR, `${name}.tsx`)
  if (!fs.existsSync(tsxPath)) return
  const tsxContent = fs.readFileSync(tsxPath, 'utf-8')
  const title = parseTitle(tsxContent, name)
  const items = parseItems(tsxContent)
  if (!items.length) return

  const meta = buildMeta(tsxContent, items)

  writeVue(name, title, items, meta)
  writeHtml(name, title, items, meta)
  writeWeapp(name, title, items, meta)
})
