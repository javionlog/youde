type Target = Parameters<typeof useSize>[0]

export const useScreen = (target?: Target | null) => {
  const resolvedTarget = target ?? document.querySelector('html')
  const size = useSize(resolvedTarget)
  const rawWidth = size?.width

  // fix keep-alive shake
  const lastValidWidthRef = useRef<number | undefined>(undefined)
  if (rawWidth !== undefined && rawWidth > 0) {
    lastValidWidthRef.current = rawWidth
  }
  const screenWidth = rawWidth === 0 ? lastValidWidthRef.current : rawWidth

  const breakpoint = useMemo(() => {
    if (screenWidth === undefined) {
      return SCREEN_SIZE_KEYS[SCREEN_SIZE_KEYS.length - 1] as ScreenSizeKey
    }
    for (const [key, val] of Object.entries(SCREEN_SIZE_MAP)) {
      if (screenWidth >= val[0] && screenWidth < val[1]) {
        return key as ScreenSizeKey
      }
    }
    return SCREEN_SIZE_KEYS[SCREEN_SIZE_KEYS.length - 1] as ScreenSizeKey
  }, [screenWidth])

  return {
    breakpoint,
    isMobile: breakpoint === 'xs',
    screenWidth
  }
}
