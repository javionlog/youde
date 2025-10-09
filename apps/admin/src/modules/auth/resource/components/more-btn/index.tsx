import { MoreIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { SetLocaleBtn } from './set-locale-btn'
import { ViewRoleBtn } from './view-role-btn'
import { ViewUserBtn } from './view-user-btn'

interface Props {
  rowData: ResourceNode
  refresh: () => void
}

const { GlDropdownMenu, GlDropdownItem } = GlDropdown

export const MoreBtn = (props: Props) => {
  const { rowData, refresh } = props
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
        <GlDropdownItem>
          <SetLocaleBtn rowData={rowData} refresh={refresh} />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
