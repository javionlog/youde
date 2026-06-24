import { ChevronDownIcon, RefreshIcon } from 'tdesign-icons-react'
import type { DropdownOption, TabValue } from 'tdesign-react'

export const MenuTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const tabs = useTabStore(state => state.tabs)
  const { deleteTab, deleteLeftTabs, deleteRightTabs, deleteOtherTabs, clearTabs, refreshTab } =
    useTabStore()
  const resources = useResourceStore.getState().getResources()
  const lang = camelCase(useLocaleStore(state => state.lang))

  const allResources = [...layoutMenus, ...resources]
  const activeResourceItem = allResources.find(o => `/${o.path}` === location.pathname)
  const activeTabIndex = activeResourceItem
    ? tabs.findIndex(o => o.id === activeResourceItem.id)
    : -1

  const pendingTabValueRef = useRef<string | null>(null)
  const removingTabRef = useRef(false)

  const locationTabId = activeResourceItem?.id ?? tabs[0]?.id

  if (pendingTabValueRef.current && pendingTabValueRef.current === locationTabId) {
    pendingTabValueRef.current = null
  }

  const tabValue: TabValue = pendingTabValueRef.current ?? locationTabId

  const onRefreshTab = (value?: string) => {
    if (value && value !== activeResourceItem?.id) {
      return
    }
    if (activeResourceItem) {
      refreshTab(location.pathname)
    }
  }

  const onRemoveTab = (value?: string) => {
    if (value && value !== activeResourceItem?.id) {
      deleteTab(value)
      return
    }
    if (activeResourceItem && !activeResourceItem.isAffix) {
      const currentIndex = tabs.findIndex(o => o.id === activeResourceItem.id)
      if (currentIndex === -1) return
      const nextTab = tabs[currentIndex + 1]
      const prevTab = tabs[currentIndex - 1]
      const homeTab = tabs.find(o => o.id === 'home')
      const targetTab = nextTab ?? prevTab ?? homeTab
      if (targetTab) {
        pendingTabValueRef.current = targetTab.id
      }
      removingTabRef.current = true
      deleteTab(activeResourceItem.id)
      if (nextTab) {
        return navigate(`/${nextTab.path}`)
      }
      if (prevTab) {
        return navigate(`/${prevTab.path}`)
      }
      if (homeTab) {
        navigate(`/${homeTab.path}`)
      }
    }
  }

  const dropdownOptions = [
    {
      content: t('action.refreshCurrent'),
      onClick: () => {
        if (activeResourceItem) {
          refreshTab(location.pathname)
        }
      }
    },
    {
      content: t('action.closeCurrent'),
      onClick: () => {
        onRemoveTab()
      }
    },
    {
      content: t('action.closeLeft'),
      onClick: () => {
        if (activeTabIndex !== -1) deleteLeftTabs(activeTabIndex)
      }
    },
    {
      content: t('action.closeRight'),
      onClick: () => {
        if (activeTabIndex !== -1) deleteRightTabs(activeTabIndex)
      }
    },
    {
      content: t('action.closeOthers'),
      onClick: () => {
        if (activeResourceItem) {
          deleteOtherTabs(activeResourceItem.id)
        }
      }
    },
    {
      content: t('action.closeAll'),
      onClick: () => {
        const homeTab = tabs.find(o => o.id === 'home')
        if (homeTab) {
          pendingTabValueRef.current = homeTab.id
        }
        clearTabs()
        if (homeTab) {
          navigate(`/${homeTab.path}`)
        }
      }
    }
  ] satisfies DropdownOption[]

  const onChange = (val: TabValue) => {
    if (removingTabRef.current) {
      removingTabRef.current = false
      return
    }
    const tab = tabs.find(o => o.id === val)
    if (tab) {
      pendingTabValueRef.current = String(val)
      navigate(`/${tab.path}`)
    }
  }

  return (
    <div className='flex items-center'>
      <GlTabs value={tabValue} size='small' onChange={onChange} className='min-w-0 grow'>
        {tabs.map(item => {
          const menuLocale = item.locales?.find(o => o.field === 'name')
          const menuName = menuLocale?.[lang as 'enUs'] ?? item.name

          return (
            <GlTabPanel
              key={item.id}
              label={
                <button className='flex items-center gap-1'>
                  {item.id === tabValue && (
                    <RefreshIcon
                      onClick={e => {
                        e.stopPropagation()
                        onRefreshTab(item.id)
                      }}
                    />
                  )}
                  <span>{menuName}</span>
                </button>
              }
              value={item.id}
              removable={!item.isAffix}
              onRemove={({ value }) => onRemoveTab(value as string)}
            />
          )
        })}
      </GlTabs>
      <GlDropdown options={dropdownOptions} trigger='click'>
        <Button theme='default' shape='square' size='large' className='shrink-0'>
          <ChevronDownIcon size='24px' />
        </Button>
      </GlDropdown>
    </div>
  )
}
