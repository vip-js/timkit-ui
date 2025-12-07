'use client'

import { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import type { RegistryItem } from '@timui/core'
import { LoaderCircleIcon } from 'lucide-react'

interface ComponentLoaderProps {
  component: RegistryItem
}

export default function ComponentLoader<TProps extends object>({
  component,
  ...props
}: ComponentLoaderProps & TProps) {
  if (!component.files?.length) {
    return null
  }
  // Allow loading for all components, assuming they are compatible with client loading or handled gracefully
  // if (!(component.meta as any)?.clientOnly) {
  //   return null
  // }

  const path = component.files[0].path
  const newPath = path.replace('registry/', '').replace(/\.tsx$/, '')
  const Component = dynamic(() => import(`@/registry/${newPath}`).catch(() => () => null), {
    loading: () => (
      <div data-comp-loading="true" className="peer flex min-h-20 items-center justify-center">
        <span className="sr-only">Loading component...</span>
        <LoaderCircleIcon className="text-input -ms-1 animate-spin" size={24} aria-hidden="true" />
      </div>
    ),
    ssr: false,
  }) as ComponentType<TProps>

  return <Component {...(props as TProps)} currentPage={1} totalPages={10} />
}
