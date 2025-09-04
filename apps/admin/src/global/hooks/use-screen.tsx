export const useScreen = () => {
  const { width: screenWidth } = useSize(document.querySelector('html'))!

  const breakpoint = useMemo(() => {
    if (screenWidth < parseInt(SCREEN_SIZE_VALUES[0])) {
      return 'xs'
    }
    for (let i = 0; i < SCREEN_SIZE_VALUES.length; i++) {
      if (
        screenWidth >= parseInt(SCREEN_SIZE_VALUES[i]) &&
        screenWidth < parseInt(SCREEN_SIZE_VALUES[i + 1])
      ) {
        return SCREEN_SIZE_KEYS[i - 1]
      }
    }
    return SCREEN_SIZE_KEYS[SCREEN_SIZE_KEYS.length - 1]
  }, [screenWidth])

  return {
    breakpoint,
    isMobile: ['xs', 'sm'].includes(breakpoint)
  }
}
