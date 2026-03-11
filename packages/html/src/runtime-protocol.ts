export type HtmlCapabilityLevel = 'template-only' | 'template+adapter'

export type HtmlRuntimeCapability = {
  name: string
  level: HtmlCapabilityLevel
  selector?: string
  initializer?: string
}

export type HtmlRuntimeInitializer = (root?: ParentNode) => void

export type HtmlRuntimeRegistry = Record<string, HtmlRuntimeInitializer>

export type HtmlRuntimeProtocol = {
  rootAttribute: string
  autoAttribute: string
  autoValue: string
}

export type HtmlRuntimeInitOptions = {
  components?: string[]
}

export type HtmlRuntimeAutoInitOptions = HtmlRuntimeInitOptions & {
  document?: Document
  root?: ParentNode
  selector?: string
  immediate?: boolean
}

type CreateHtmlRuntimeOptions = {
  capabilities: HtmlRuntimeCapability[]
  initializers: HtmlRuntimeRegistry
  protocol: HtmlRuntimeProtocol
}

function normalizeRoot(root?: ParentNode | null): ParentNode | null {
  if (root) return root
  if (typeof document !== 'undefined') return document
  return null
}

export function createHtmlRuntime(options: CreateHtmlRuntimeOptions) {
  const capabilityMap = new Map(
    options.capabilities.map((capability) => [capability.name, capability])
  )
  const componentNames = options.capabilities
    .filter((capability) => capability.level === 'template+adapter')
    .map((capability) => capability.name)

  function initHtmlComponent(name: string, root?: ParentNode | null): boolean {
    const initializer = options.initializers[name]
    const targetRoot = normalizeRoot(root)
    if (!initializer || !targetRoot) return false
    initializer(targetRoot)
    return true
  }

  function initHtmlRuntime(root?: ParentNode | null, initOptions: HtmlRuntimeInitOptions = {}) {
    const targetRoot = normalizeRoot(root)
    if (!targetRoot) {
      return {
        root: null,
        initialized: [] as string[],
        skipped: componentNames.slice(),
      }
    }

    const requested = initOptions.components?.length ? initOptions.components : componentNames
    const initialized: string[] = []
    const skipped: string[] = []

    for (const name of requested) {
      if (initHtmlComponent(name, targetRoot)) initialized.push(name)
      else skipped.push(name)
    }

    return {
      root: targetRoot,
      initialized,
      skipped,
    }
  }

  function autoInitHtmlRuntime(autoOptions: HtmlRuntimeAutoInitOptions = {}) {
    const targetDocument =
      autoOptions.document ||
      (normalizeRoot(autoOptions.root) instanceof Document
        ? (normalizeRoot(autoOptions.root) as Document)
        : undefined) ||
      (typeof document !== 'undefined' ? document : undefined)

    if (!targetDocument) {
      return () => {}
    }

    const selector =
      autoOptions.selector ||
      `[${options.protocol.rootAttribute}][${options.protocol.autoAttribute}="${options.protocol.autoValue}"]`

    const run = () => {
      const explicitRoot = normalizeRoot(autoOptions.root)
      if (explicitRoot && explicitRoot !== targetDocument) {
        return initHtmlRuntime(explicitRoot, autoOptions)
      }

      const markedRoots = Array.from(targetDocument.querySelectorAll(selector))
      if (markedRoots.length > 0) {
        return markedRoots.map((markedRoot) => initHtmlRuntime(markedRoot, autoOptions))
      }

      return [initHtmlRuntime(targetDocument, autoOptions)]
    }

    if (!autoOptions.immediate && targetDocument.readyState === 'loading') {
      const onReady = () => {
        run()
      }
      targetDocument.addEventListener('DOMContentLoaded', onReady, { once: true })
      return () => {
        targetDocument.removeEventListener('DOMContentLoaded', onReady)
      }
    }

    run()
    return () => {}
  }

  return {
    capabilities: options.capabilities,
    capabilityMap,
    componentNames,
    protocol: options.protocol,
    initHtmlComponent,
    initHtmlRuntime,
    autoInitHtmlRuntime,
  }
}
