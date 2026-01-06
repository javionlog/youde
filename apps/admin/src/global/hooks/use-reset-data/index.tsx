export const useResetData = () => {
  const resetStore = () => {
    useUserStore.setState({ user: null })
    useResourceStore.setState({ resourceTree: [] })
    useHttpStore.setState({ responseStatus: 0 })
    useTabStore.getState().clearTabs()
  }

  return { resetStore }
}
