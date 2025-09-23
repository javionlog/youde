import type { Role } from '@/global/api'
import { SetResourceBtn } from './set-resource-btn'
import { ViewUserBtn } from './view-user-btn'

type Props = {
  rowData: Role
  refresh: () => void
}

const { DropdownMenu, DropdownItem } = Dropdown

export const MoreBtn = (props: Props) => {
  const { rowData, refresh } = props
  const { t } = useTranslation()

  return (
    <Dropdown>
      <span className='text-(--td-brand-color)'>{t('label.more')}</span>
      <DropdownMenu>
        <DropdownItem>
          <SetResourceBtn rowData={rowData} refresh={refresh} />
        </DropdownItem>
        <DropdownItem>
          <ViewUserBtn rowData={rowData} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
