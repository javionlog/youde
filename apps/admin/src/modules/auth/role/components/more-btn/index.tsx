import type { GetAdminRoleResponse } from '@/global/api'
import { SetResourceBtn } from './set-resource-btn'
import { ViewResourceBtn } from './view-resource-btn'
import { ViewUserBtn } from './view-user-btn'

interface Props {
  rowData: GetAdminRoleResponse
  refresh: () => void
}

export const MoreBtn = (props: Props) => {
  const { rowData, refresh } = props
  const { t } = useTranslation()

  return (
    <GlDropdown>
      <span className='text-(--td-brand-color)'>{t('label.more')}</span>
      <GlDropdownMenu>
        <GlDropdownItem>
          <SetResourceBtn rowData={rowData} refresh={refresh} />
        </GlDropdownItem>
        <GlDropdownItem>
          <ViewUserBtn rowData={rowData} />
        </GlDropdownItem>
        <GlDropdownItem>
          <ViewResourceBtn rowData={rowData} />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
