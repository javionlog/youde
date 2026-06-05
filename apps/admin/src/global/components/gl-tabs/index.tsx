import type { TabsProps } from 'tdesign-react'

export const GlTabs = (
  props: Omit<TabsProps, 'size'> & {
    size?: TabsProps['size'] | 'small'
  }
) => {
  const { className, children, size, ...rest } = props
  const tabSize = size as TabsProps['size']
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const scrollEl = wrap.querySelector<HTMLElement>('.t-tabs__nav-scroll')
    if (!scrollEl) return

    let offset = 0
    let lastX = 0
    let startX = 0
    let startY = 0
    let isHorizontal: boolean | null = null
    let velocityX = 0
    let lastMoveTime = 0
    let rafId: number | null = null

    const getNavWrap = () => scrollEl.querySelector<HTMLElement>('.t-tabs__nav-wrap')

    const getMax = () => {
      const navWrap = getNavWrap()
      if (!navWrap) return 0
      return Math.max(0, navWrap.offsetWidth - scrollEl.offsetWidth)
    }

    const applyTransform = (val: number) => {
      const navWrap = getNavWrap()
      if (navWrap) navWrap.style.transform = `translate(${-val}px, 0)`
    }

    const setTransition = (enabled: boolean) => {
      const navWrap = getNavWrap()
      if (navWrap) navWrap.style.transition = enabled ? '' : 'none'
    }

    const syncTdesignState = (target: number) => {
      const navWrap = getNavWrap()
      if (!navWrap) return
      const matrix = new DOMMatrix(getComputedStyle(navWrap).transform)
      const current = Math.abs(matrix.m41)
      const delta = target - current
      if (Math.abs(delta) < 0.5) return
      scrollEl.dispatchEvent(
        new WheelEvent('wheel', { deltaX: delta, deltaY: 0, bubbles: false, cancelable: true })
      )
    }

    const runInertia = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      const decay = 0.92
      const step = () => {
        velocityX *= decay
        if (Math.abs(velocityX) < 0.3) {
          setTransition(true)
          syncTdesignState(offset)
          return
        }
        const max = getMax()
        offset = Math.max(0, Math.min(offset + velocityX, max))
        applyTransform(offset)
        rafId = requestAnimationFrame(step)
      }
      rafId = requestAnimationFrame(step)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      lastX = startX
      isHorizontal = null
      velocityX = 0
      lastMoveTime = Date.now()
      const navWrap = getNavWrap()
      if (navWrap) {
        const matrix = new DOMMatrix(getComputedStyle(navWrap).transform)
        offset = Math.abs(matrix.m41)
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const dx = currentX - lastX

      if (isHorizontal === null) {
        const totalDx = Math.abs(currentX - startX)
        const totalDy = Math.abs(currentY - startY)
        if (totalDx < 3 && totalDy < 3) return
        isHorizontal = totalDx >= totalDy
      }

      if (!isHorizontal) return

      e.preventDefault()
      e.stopPropagation()

      setTransition(false)

      const now = Date.now()
      const dt = Math.max(now - lastMoveTime, 1)
      velocityX = (-dx / dt) * 16
      lastMoveTime = now
      lastX = currentX

      const max = getMax()
      offset = Math.max(0, Math.min(offset - dx, max))
      applyTransform(offset)
    }

    const onTouchEnd = () => {
      if (!isHorizontal) return
      if (Math.abs(velocityX) > 1) {
        runInertia()
      } else {
        setTransition(true)
        syncTdesignState(offset)
      }
    }

    scrollEl.addEventListener('touchstart', onTouchStart, { passive: true })
    scrollEl.addEventListener('touchmove', onTouchMove, { passive: false })
    scrollEl.addEventListener('touchend', onTouchEnd, { passive: true })
    scrollEl.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      scrollEl.removeEventListener('touchstart', onTouchStart)
      scrollEl.removeEventListener('touchmove', onTouchMove)
      scrollEl.removeEventListener('touchend', onTouchEnd)
      scrollEl.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])

  return (
    <div ref={wrapRef} className={className}>
      <Tabs className={`gl-tabs ${size === 'small' ? 't-size-s' : ''}`} size={tabSize} {...rest}>
        {children}
      </Tabs>
    </div>
  )
}

export const GlTabPanel = Tabs.TabPanel
