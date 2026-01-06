import { UserCircleIcon } from 'tdesign-icons-react'
import { ResetPasswordBtn } from './reset-password-btn'
import { SignOutBtn } from './sign-out-btn'
import { ViewUserInfoBtn } from './view-user-info-btn'

export const UserAvatar = () => {
  return (
    <GlDropdown trigger='click'>
      <UserCircleIcon size='24px' />
      <GlDropdownMenu>
        <GlDropdownItem>
          <ViewUserInfoBtn />
        </GlDropdownItem>
        <GlDropdownItem>
          <ResetPasswordBtn />
        </GlDropdownItem>
        <GlDropdownItem>
          <SignOutBtn />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
