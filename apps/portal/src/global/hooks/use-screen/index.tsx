type Target = Parameters<typeof useSize>[0]

export const useScreen = (target?: Target) => {
  const { width: screenWidth } = useSize(target ?? document.querySelector('html'))!

  const breakpoint = useMemo(() => {
    for (const [key, val] of Object.entries(SCREEN_SIZE_MAP)) {
      if (screenWidth >= val[0] && screenWidth < val[1]) {
        return key as ScreenSizeKey
      }
    }
    return SCREEN_SIZE_KEYS[SCREEN_SIZE_KEYS.length - 1] as ScreenSizeKey
  }, [screenWidth])

  return {
    breakpoint,
    isMobile: breakpoint === 'xs'
  }
}
