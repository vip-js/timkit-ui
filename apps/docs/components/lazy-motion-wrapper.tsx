"use client"

import { ReactNode } from "react"
import { domAnimation, LazyMotion } from "framer-motion"

export default ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
)
