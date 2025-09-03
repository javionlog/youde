export const AppHeader = () => {
  return (
    <div className='flex justify-between px-5 h-(--td-comp-size-xxxl) bg-(--td-bg-color-container)'>
      <div></div>
      <div className='flex items-center justify-end gap-2'>
        <LangSelect />
        <ThemeSelect />
        <UserAvatar />
      </div>
    </div>
  )
}
