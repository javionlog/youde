import type { User } from '@/global/api'
import { SetRoleBtn } from './set-role-btn'
import { ViewResourceBtn } from './view-resource-btn'

interface Props {
  rowData: User
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
          <ViewResourceBtn rowData={rowData} />
        </GlDropdownItem>
      </GlDropdownMenu>
    </GlDropdown>
  )
}
