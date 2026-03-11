type WeappComponentOptionsConfig = {
  pureData?: boolean
  multipleSlots?: boolean
  virtualHost?: boolean
}

export const WEAPP_STYLE_ISOLATION = 'apply-shared' as const
export const WEAPP_EXTERNAL_CLASSES = ['ext-class'] as const
export const WEAPP_PURE_DATA_PATTERN = /^_/

export function createWeappOptions(config: WeappComponentOptionsConfig = {}) {
  const options: Record<string, unknown> = {
    styleIsolation: WEAPP_STYLE_ISOLATION,
  }

  if (config.pureData) {
    options.pureDataPattern = WEAPP_PURE_DATA_PATTERN
  }

  if (config.multipleSlots) {
    options.multipleSlots = true
  }

  if (config.virtualHost) {
    options.virtualHost = true
  }

  return options
}

export function createWeappBaseProps(defaultId?: string) {
  return {
    ...(defaultId
      ? {
          id: { type: String, value: defaultId },
        }
      : {}),
    extClass: { type: String, value: '' },
  } as const
}
