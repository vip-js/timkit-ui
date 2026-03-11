'use client'

import { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import type { RegistryItem } from '@timui/core'
import { LoaderCircleIcon } from 'lucide-react'

import { registryComponentManifest } from '@/registry/registry-manifest'

interface ComponentLoaderProps {
  component: RegistryItem
  componentPath?: string
}

type RegistryComponentModule = { default: ComponentType<object> }
type RegistryComponentManifest = typeof registryComponentManifest
type RegistryComponentKey = keyof RegistryComponentManifest
type RegistryComponentLoader = RegistryComponentManifest[RegistryComponentKey]
type RegistryComponentLoaderModule = Awaited<ReturnType<RegistryComponentLoader>>

export default function ComponentLoader<TProps extends object>({
  component,
  componentPath,
  ...props
}: ComponentLoaderProps & TProps) {
  const reactFile = componentPath
    ? component.files?.find((file) => file.path === componentPath)
    : component.files?.find((file) => file.path.endsWith('.tsx'))

  if (!reactFile) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/20 w-full min-h-[100px]">
        No React preview available
      </div>
    )
  }

  const hasManifestEntry = (path: string): path is RegistryComponentKey =>
    Object.prototype.hasOwnProperty.call(registryComponentManifest, path)

  const loadComponent = hasManifestEntry(reactFile.path)
    ? registryComponentManifest[reactFile.path]
    : undefined

  if (!loadComponent) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/20 w-full min-h-[100px]">
        Preview not available
      </div>
    )
  }

  const Component = dynamic(
    () => {
      const placeholder: ComponentType<object> = () => (
        <div className="flex items-center justify-center p-8 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/20 w-full min-h-[100px]">
          Preview available in examples
        </div>
      )

      const failed: ComponentType<object> = () => (
        <div className="text-red-500 text-sm">Failed to load component</div>
      )

      return loadComponent()
        .then((mod) => {
          const moduleWithDefault = mod as RegistryComponentLoaderModule & {
            default?: ComponentType<object>
          }
          if (moduleWithDefault.default) {
            return { default: moduleWithDefault.default }
          }
          return { default: placeholder }
        })
        .catch((err) => {
          console.error('Failed to lead component:', err)
          return { default: failed }
        })
    },
    {
      loading: () => (
        <div data-comp-loading="true" className="peer flex min-h-20 items-center justify-center">
          <span className="sr-only">Loading component...</span>
          <LoaderCircleIcon
            className="text-input -ms-1 animate-spin"
            size={24}
            aria-hidden="true"
          />
        </div>
      ),
      ssr: false,
    }
  ) as ComponentType<TProps>

  return <Component {...(props as TProps)} currentPage={1} totalPages={10} />
}
