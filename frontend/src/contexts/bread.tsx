"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

interface BreadContextValue {
  labels: string[]
  setLabels: (labels: string[]) => void
}

const BreadContext = createContext<BreadContextValue | null>(null)

export function BreadProvider({
  children,
}: {
  children: ReactNode
}) {
  const [labels, setLabels] = useState<string[]>([])
  const value = useMemo<BreadContextValue>(() => ({ labels, setLabels }), [labels])

  return (
    <BreadContext.Provider value={value}>
      {children}
    </BreadContext.Provider>
  )
}

export function useBread(...labels: string[]) {
  const ctx = useContext(BreadContext)
  if (!ctx) {
    throw new Error("useBread must be used within an BreadProvider")
  }

  useEffect(() => {
    ctx.setLabels(labels)
  }, [labels.join(",")])

  return ctx
}
