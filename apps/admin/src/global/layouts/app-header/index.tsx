import { MenuBreadcrumb } from './menu-breadcrumb'
import { MenuTabs } from './menu-tabs'
import { UserAvatar } from './user-avatar'

export const AppHeader = () => {
  return (
    <div className='app-header sticky top-0 z-10 shrink-0'>
      <div className='flex min-h-(--td-comp-size-xxxl) justify-between border-(--td-component-border) border-b-1 bg-(--td-bg-color-container) px-5'>
        <MenuBreadcrumb />
        <div className='flex items-center justify-end gap-2'>
          <GlLangSelect />
          <GlThemeSelect />
          <UserAvatar />
        </div>
      </div>
      <MenuTabs />
    </div>
  )
}
