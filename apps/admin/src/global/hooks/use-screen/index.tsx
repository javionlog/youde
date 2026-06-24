type Target = Parameters<typeof useSize>[0]

export const useScreen = (target?: Target | null) => {
  const resolvedTarget = target === undefined ? document.querySelector('html') : target
  const size = useSize(resolvedTarget)
  const screenWidth = size?.width

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
