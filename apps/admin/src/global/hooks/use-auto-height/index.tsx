import type { RefObject } from 'react'

type ElementType = Element | HTMLElement | null | undefined
type Target = RefObject<ElementType> | ElementType
type ExtendOptions = {
  afterTarget?: Target
  afterHeight: number
}

export const useAutoHeight = (
  target: Target,
  extendOptions?: ExtendOptions
): { height: number } => {
  const { afterTarget, afterHeight } = extendOptions ?? { afterTarget: null, afterHeight: 0 }
  const [height, setHeight] = useState(0)
  const observerRef = useRef<MutationObserver>(null)

  const getTarget = useCallback((): ElementType => {
    if (target instanceof HTMLElement) {
      return target
    }
    if (target && 'current' in target) {
      return target.current
    }
    return null
  }, [target])

  const getAfterTarget = useCallback((): ElementType => {
    if (afterTarget instanceof HTMLElement) {
      return afterTarget
    }
    if (afterTarget && 'current' in afterTarget) {
      return afterTarget.current
    }
    return null
  }, [afterTarget])

  const updateHeight = useCallback(() => {
    const el = getTarget()
    const afterEl = getAfterTarget()
    let afterElHeight = 0
    if (!el) {
      return
    }
    if (afterEl) {
      afterElHeight = afterEl.getBoundingClientRect().height
    }
    const { top } = el.getBoundingClientRect()
    setHeight(window.innerHeight - top - afterElHeight - afterHeight)
  }, [getTarget, getAfterTarget])

  useEffect(() => {
    const el = getTarget()
    if (!el) {
      return
    }

    observerRef.current = new MutationObserver(() => {
      updateHeight()
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [getTarget, getAfterTarget])

  useEffect(() => {
    const el = document.querySelector('body')!
    observerRef.current?.observe(el, {
      attributeFilter: ['style', 'class'],
      attributes: true,
      childList: true,
      subtree: true
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [getTarget, getAfterTarget])

  useEffect(() => {
    const handleResize = () => {
      updateHeight()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { height }
}
