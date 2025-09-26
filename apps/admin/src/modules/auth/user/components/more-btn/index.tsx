import type { User } from '@/global/api'
import { SetRoleBtn } from './set-role-btn'
import { ViewResourceBtn } from './view-resource-btn'

interface Props {
  rowData: User
  refresh: () => void
}

const { DropdownMenu, DropdownItem } = Dropdown

export const MoreBtn = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()

  return (
    <Dropdown>
      <span className='text-(--td-brand-color)'>{t('label.more')}</span>
      <DropdownMenu>
        <DropdownItem>
          <SetRoleBtn rowData={rowData} />
        </DropdownItem>
        <DropdownItem>
          <ViewResourceBtn rowData={rowData} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
