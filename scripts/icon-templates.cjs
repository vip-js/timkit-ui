const SVG_BASE_CLASS = 'h-4 w-4 shrink-0 opacity-60 transition-transform duration-200'
const DEFAULT_SVG_CONFIG = {
  size: 16,
  strokeWidth: 2,
  strokeColor: 'currentColor',
}

const SVG_CHEVRON_TEMPLATE = `<svg
  class="{{className}}"
  data-{{dataAttr}}
  data-icon-type="chevron"
  aria-hidden="true"
  viewBox="0 0 24 24"
  width="{{size}}"
  height="{{size}}"
  fill="none"
  stroke="{{strokeColor}}"
  stroke-width="{{strokeWidth}}"
  stroke-linecap="round"
  stroke-linejoin="round"
  style="transform: {{rotation}};"
>
  <polyline points="6 9 12 15 18 9"></polyline>
</svg>`

const SVG_PLUS_TEMPLATE = `<svg
  class="{{className}}"
  data-{{dataAttr}}
  data-icon-type="plus"
  aria-hidden="true"
  viewBox="0 0 24 24"
  width="{{size}}"
  height="{{size}}"
  fill="none"
  stroke="{{strokeColor}}"
  stroke-width="{{strokeWidth}}"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <line x1="12" y1="5" x2="12" y2="19" data-plus-vertical style="opacity: {{verticalOpacity}};"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>`

const renderSvg = (template, vars) => {
  let output = template
  Object.entries(vars).forEach(([key, value]) => {
    output = output.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  })
  return output
}

const buildChevronSvg = (attrs) => {
  const config = { ...DEFAULT_SVG_CONFIG, ...(attrs.config || {}) }
  const className = attrs.className ? `${SVG_BASE_CLASS} ${attrs.className}` : SVG_BASE_CLASS
  const rotation = attrs.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
  return renderSvg(SVG_CHEVRON_TEMPLATE, {
    className,
    dataAttr: attrs.dataAttr,
    rotation,
    size: String(config.size),
    strokeWidth: String(config.strokeWidth),
    strokeColor: config.strokeColor,
  })
}

const buildPlusSvg = (attrs) => {
  const config = { ...DEFAULT_SVG_CONFIG, ...(attrs.config || {}) }
  const className = attrs.className ? `${SVG_BASE_CLASS} ${attrs.className}` : SVG_BASE_CLASS
  const verticalOpacity = attrs.isOpen ? '0' : '1'
  return renderSvg(SVG_PLUS_TEMPLATE, {
    className,
    dataAttr: attrs.dataAttr,
    verticalOpacity,
    size: String(config.size),
    strokeWidth: String(config.strokeWidth),
    strokeColor: config.strokeColor,
  })
}

module.exports = {
  SVG_BASE_CLASS,
  DEFAULT_SVG_CONFIG,
  SVG_CHEVRON_TEMPLATE,
  SVG_PLUS_TEMPLATE,
  renderSvg,
  buildChevronSvg,
  buildPlusSvg,
}
