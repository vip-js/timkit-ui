'use client'

import { ReactNode } from 'react'
import { domAnimation, LazyMotion } from 'framer-motion'

const LazyMotionWrapper = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
)

export default LazyMotionWrapper
