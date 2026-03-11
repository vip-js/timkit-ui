/**
 * @timui/core/schemas
 *
 * 语义切片：UCS (Universal Component Schema) 元数据注册表。
 *
 * 适用场景：
 * - CLI 工具（npx timkit add）：读取组件 schema 生成代码，无需引入 Zag.js / CVA
 * - 文档站自动生成：Props 表格、Variants 展示、平台支持矩阵
 * - AI 代码生成工具：提供机器可读的组件规范作为 context
 * - Registry 构建脚本：schema 驱动的 registry 校验
 *
 * ⚠️ 本文件不得引入任何 @zag-js/* 或 class-variance-authority 模块，
 *    保持零运行时依赖（纯数据 + 纯类型）。
 */

// ─── 运行时数据：组件注册表（含所有 UCS schema 实例）───────────────────────
export { ucsRegistry } from '../shared/registry'
export type { UcsRegistry } from '../shared/registry'

// ─── 组件名称枚举与类型 ────────────────────────────────────────────────────
export { componentNames } from '../shared/component-names'
export type { ComponentName } from '../shared/component-names'

// ─── 组件 Parts 映射 ───────────────────────────────────────────────────────
export { componentParts } from '../shared/component-parts'
export type { ComponentPartsMap } from '../shared/component-parts'

// ─── UCS 核心类型 ──────────────────────────────────────────────────────────
export type {
  UCS,
  UCSRegistry,
  ComponentPart,
  ComponentLogic,
} from '../shared/ucs'
export { defineUCS } from '../shared/ucs'

// ─── Schema 基础类型（Prop / Slot / Variant / Interaction）────────────────
export type {
  ComponentSchema,
  ComponentProp,
  ComponentSlot,
  ComponentVariant,
  ComponentVariantOption,
  ComponentInteraction,
} from '../shared/schema'

// ─── Framework Manifest 类型 ───────────────────────────────────────────────
export type { FrameworkId, FrameworkManifest } from '../shared/framework-manifest'

// ─── Logic Registry 类型 ──────────────────────────────────────────────────
export type { LogicDefinition, LogicRegistry } from '../shared/logic'

// ─── 各组件的独立 schema 实例（供精确按需引用）────────────────────────────
export { default as accordionSchema } from '../components/accordion/schema'
export { default as alertSchema } from '../components/alert/schema'
export { default as alertDialogSchema } from '../components/alert-dialog/schema'
export { default as avatarSchema } from '../components/avatar/schema'
export { default as badgeSchema } from '../components/badge/schema'
export { default as bannerSchema } from '../components/banner/schema'
export { default as breadcrumbSchema } from '../components/breadcrumb/schema'
export { default as buttonSchema } from '../components/button/schema'
export { default as calendarSchema } from '../components/calendar/schema'
export { default as cardSchema } from '../components/card/schema'
export { default as checkboxSchema } from '../components/checkbox/schema'
export { default as checkboxTreeSchema } from '../components/checkbox-tree/schema'
export { default as collapsibleSchema } from '../components/collapsible/schema'
export { default as comboboxSchema } from '../components/combobox/schema'
export { default as commandSchema } from '../components/command/schema'
export { default as datePickerSchema } from '../components/date-picker/schema'
export { default as datefieldSchema } from '../components/datefield/schema'
export { default as dialogSchema } from '../components/dialog/schema'
export { default as dropdownMenuSchema } from '../components/dropdown-menu/schema'
export { default as hoverCardSchema } from '../components/hover-card/schema'
export { default as imageCropperSchema } from '../components/image-cropper/schema'
export { default as inputSchema } from '../components/input/schema'
export { default as labelSchema } from '../components/label/schema'
export { default as multiselectSchema } from '../components/multiselect/schema'
export { default as navbarSchema } from '../components/navbar/schema'
export { default as navigationMenuSchema } from '../components/navigation-menu/schema'
export { default as notificationSchema } from '../components/notification/schema'
export { default as paginationSchema } from '../components/pagination/schema'
export { default as popoverSchema } from '../components/popover/schema'
export { default as progressSchema } from '../components/progress/schema'
export { default as radioGroupSchema } from '../components/radio-group/schema'
export { default as resizableSchema } from '../components/resizable/schema'
export { default as scrollAreaSchema } from '../components/scroll-area/schema'
export { default as selectSchema } from '../components/select/schema'
export { default as selectNativeSchema } from '../components/select-native/schema'
export { default as separatorSchema } from '../components/separator/schema'
export { default as sheetSchema } from '../components/sheet/schema'
export { default as sliderSchema } from '../components/slider/schema'
export { default as stepperSchema } from '../components/stepper/schema'
export { default as switchSchema } from '../components/switch/schema'
export { default as tableSchema } from '../components/table/schema'
export { default as tabsSchema } from '../components/tabs/schema'
export { default as tagsInputSchema } from '../components/tags-input/schema'
export { default as textareaSchema } from '../components/textarea/schema'
export { default as timelineSchema } from '../components/timeline/schema'
export { default as toastSchema } from '../components/toast/schema'
export { default as toggleSchema } from '../components/toggle/schema'
export { default as toggleGroupSchema } from '../components/toggle-group/schema'
export { default as tooltipSchema } from '../components/tooltip/schema'
export { default as treeSchema } from '../components/tree/schema'
