export const AppHeader = () => {
  return (
    <div className='app-header flex h-(--td-comp-size-xxxl) justify-between bg-(--td-bg-color-container) px-5'>
      <div></div>
      <div className='flex items-center justify-end gap-2'>
        <LangSelect />
        <ThemeSelect />
        <UserAvatar />
      </div>
    </div>
  )
}
