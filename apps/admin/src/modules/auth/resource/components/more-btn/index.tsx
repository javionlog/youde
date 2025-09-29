import { MoreIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { ViewRoleBtn } from './view-role-btn'
import { ViewUserBtn } from './view-user-btn'

interface Props {
  rowData: ResourceNode
}

const { GlDropdownMenu, GlDropdownItem } = GlDropdown

export const MoreBtn = (props: Props) => {
  const { rowData } = props
  return (
    <GlDropdown>
      <MoreIcon />
      <GlDropdownMenu>
        <GlDropdownItem>
          <ViewUserBtn rowData={rowData} />
        </GlDropdownItem>
        <GlDropdownItem>
          <ViewRoleBtn rowData={rowData} />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
