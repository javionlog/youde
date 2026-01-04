import { MoreIcon } from 'tdesign-icons-react'
import type { TreasureCategoryNode } from '@/global/api'
import { SetLocaleBtn } from './set-locale-btn'
import { ViewTreasureBtn } from './view-treasure-btn'

interface Props {
  rowData: TreasureCategoryNode
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
          <ViewTreasureBtn rowData={rowData} />
        </GlDropdownItem>
        <GlDropdownItem>
          <SetLocaleBtn rowData={rowData} refresh={refresh} />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
