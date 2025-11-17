import type { GetAdminUserResponse } from '@/global/api'
import { SetRoleBtn } from './set-role-btn'
import { ViewResourceBtn } from './view-resource-btn'
import { ViewRoleBtn } from './view-role-btn'

interface Props {
  rowData: GetAdminUserResponse
  refresh: () => void
}

const { GlDropdownMenu, GlDropdownItem } = GlDropdown

export const MoreBtn = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()

  return (
    <GlDropdown>
      <span className='text-(--td-brand-color)'>{t('label.more')}</span>
      <GlDropdownMenu>
        <GlDropdownItem>
          <SetRoleBtn rowData={rowData} />
        </GlDropdownItem>
        <GlDropdownItem>
          <ViewRoleBtn rowData={rowData} />
        </GlDropdownItem>
        <GlDropdownItem>
          <ViewResourceBtn rowData={rowData} />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
