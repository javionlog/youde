import { UserCircleIcon } from 'tdesign-icons-react'
import { SignOutBtn } from './sign-out-btn'
import { ViewUserInfoBtn } from './view-user-info-btn'

export const UserAvatar = () => {
  const { GlDropdownMenu, GlDropdownItem } = GlDropdown
  return (
    <GlDropdown trigger='click'>
      <UserCircleIcon size='24px' />
      <GlDropdownMenu>
        <GlDropdownItem>
          <ViewUserInfoBtn />
        </GlDropdownItem>
        <GlDropdownItem>
          <SignOutBtn />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
