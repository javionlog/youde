export const useResetData = () => {
  const resetStore = () => {
    useUserStore.setState({ user: null })
    useResourceStore.setState({ resourceTree: [] })
    useTabStore.getState().clearTabs()
  }

  return { resetStore }
}
