export const AppHeader = () => {
  return (
    <div className='app-header sticky top-0 z-10 flex h-(--td-comp-size-xxxl) shrink-0 justify-between bg-(--td-bg-color-container) px-5'>
      <div></div>
      <div className='flex items-center justify-end gap-2'>
        <LangSelect />
        <ThemeSelect />
        <UserAvatar />
      </div>
    </div>
  )
}
