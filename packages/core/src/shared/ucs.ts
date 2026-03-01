import type { ComponentSchema as BaseComponentSchema } from './schema'
import type { ComponentName } from '../components/base'

/**
 * Universal Component Schema (UCS)
 * 
 * 扩展原有的 Registry Schema，增加更深层级的结构定义与逻辑绑定。
 */

export interface ComponentPart {
    name: string
    description: string
    isRoot?: boolean
}

export interface ComponentLogic {
    provider: 'zag' | 'native' | 'none'
    machine?: string // Zag.js machine name
}

export interface UCS extends BaseComponentSchema {
    /**
     * 组件内部零件 (e.g., root, trigger, content)
     */
    parts: ComponentPart[]

    /**
     * 状态机/业务逻辑配置
     */
    logic: ComponentLogic

    /**
     * 框架特定的逻辑微调
     */
    frameworkOverrides?: {
        react?: {
            useWrapper?: boolean
        }
        weapp?: {
            templateType?: 'template' | 'component'
        }
        vue?: {
            emits?: string[]
        }
    }
}

export type UCSRegistry = Partial<Record<ComponentName, UCS>>

export const defineUCS = <const Name extends ComponentName>(schema: UCS & { name: Name }) => schema

// Re-exports from schemas are handled in the main index.ts
