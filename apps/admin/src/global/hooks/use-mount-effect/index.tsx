import { useEffect, useRef } from 'react'

type CleanupFn = () => void
// biome-ignore lint/suspicious/noConfusingVoidType: ignore
type EffectFn = () => CleanupFn | void
type AsyncEffectFn = () => Promise<CleanupFn | undefined>

export function useMountEffect(effect: EffectFn | AsyncEffectFn): void {
  const hasRunRef = useRef<boolean>(false)
  const cleanupRef = useRef<CleanupFn | undefined>(undefined)
  const effectRef = useRef<EffectFn | AsyncEffectFn>(effect)

  useEffect(() => {
    if (hasRunRef.current) return

    hasRunRef.current = true

    const result = effectRef.current()

    if (result instanceof Promise) {
      result.then(cleanup => {
        cleanupRef.current = cleanup
      })
    } else {
      cleanupRef.current = result ?? undefined
    }

    return () => {
      cleanupRef.current?.()
    }
  }, [])
}
