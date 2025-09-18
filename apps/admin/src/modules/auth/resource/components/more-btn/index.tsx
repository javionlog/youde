import { MoreIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { ViewRoleBtn } from './view-role-btn'
import { ViewUserBtn } from './view-user-btn'

type Props = {
  rowData: ResourceNode
}

const { DropdownMenu, DropdownItem } = Dropdown

export const MoreBtn = (props: Props) => {
  const { rowData } = props
  return (
    <Dropdown>
      <MoreIcon />
      <DropdownMenu>
        <DropdownItem>
          <ViewUserBtn rowData={rowData} />
        </DropdownItem>
        <DropdownItem>
          <ViewRoleBtn rowData={rowData} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
