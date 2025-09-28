import { UserCircleIcon } from 'tdesign-icons-react'
import { SignOutBtn } from './sign-out-btn'
import { ViewUserInfoBtn } from './view-user-info-btn'

export const UserAvatar = () => {
  const { DropdownMenu, DropdownItem } = Dropdown
  return (
    <Dropdown maxColumnWidth='auto' trigger='click'>
      <UserCircleIcon size='24px' />
      <DropdownMenu>
        <DropdownItem>
          <ViewUserInfoBtn />
        </DropdownItem>
        <DropdownItem>
          <SignOutBtn />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
