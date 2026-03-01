// Vue 组件注册表（自动扫描）
// 使用 Vite 的 import.meta.glob 扫描所有示例组件

const modules = import.meta.glob('./default/components/**/*.vue')

export const vueComponentManifest: Record<string, () => Promise<any>> = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => {
    const name = path
      .replace('./default/components/', '')
      .replace(/\.vue$/, '')
      .split('/')
      .pop() as string
    return [name, loader as () => Promise<any>]
  })
)
