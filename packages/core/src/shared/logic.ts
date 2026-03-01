import type { ComponentName } from '../components/base'

/**
 * Logic Definition契约
 * 
 * 用于建立组件名称、Props和运行逻辑(Api)之间的强类型绑定。
 */
export interface LogicDefinition<TProps, TApi> {
    machine: string
    props: TProps
    api: TApi
}

/**
 * Logic Registry
 * 
 * 记录全量组件的逻辑绑定关系
 */
export interface LogicRegistry extends Partial<Record<ComponentName, LogicDefinition<object, object>>> { }
