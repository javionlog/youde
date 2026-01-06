import { ChevronDownIcon, RefreshIcon } from 'tdesign-icons-react'
import type { DropdownOption, TabValue } from 'tdesign-react'

export const MenuTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const tabs = useTabStore(state => state.tabs)
  const {
    addTab,
    deleteTab,
    deleteLeftTabs,
    deleteRightTabs,
    deleteOtherTabs,
    clearTabs,
    refreshTab
  } = useTabStore()
  const resources = useResourceStore.getState().getResources()
  const lang = camelCase(useLocaleStore(state => state.lang))

  const allResources = [...layoutMenus, ...resources]
  const activeResourceItem = allResources.find(o => `/${o.path}` === location.pathname)
  const activeTabIndex = tabs.findIndex(o => `/${o.path}` === location.pathname)
  const [tabValue, setTabValue] = useState<TabValue>(activeResourceItem?.id as string)

  const onRefreshTab = (value?: string) => {
    if (value && value !== activeResourceItem?.id) {
      return
    }
    if (activeResourceItem) {
      refreshTab()
    }
  }

  const onRemoveTab = async (value?: string) => {
    if (value && value !== activeResourceItem?.id) {
      deleteTab(value)
      return
    }
    if (activeResourceItem && !activeResourceItem.isAffix) {
      deleteTab(activeResourceItem.id)
      await Promise.resolve()
      const nextTab = tabs[activeTabIndex + 1]
      const prevTab = tabs[activeTabIndex - 1]
      const homeTab = tabs.find(o => o.id === 'home')
      if (nextTab) {
        setTabValue(nextTab.id)
        return navigate(`/${nextTab.path}`)
      }
      if (prevTab) {
        setTabValue(prevTab.id)
        return navigate(`/${prevTab.path}`)
      }
      if (homeTab) {
        setTabValue(homeTab.id)
        navigate(`/${homeTab.path}`)
      }
    }
  }

  const dropdownOptions = [
    {
      content: t('action.refreshCurrent'),
      onClick: () => {
        refreshTab()
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
        deleteLeftTabs(activeTabIndex)
      }
    },
    {
      content: t('action.closeRight'),
      onClick: () => {
        deleteRightTabs(activeTabIndex)
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
      onClick: async () => {
        clearTabs()
        await Promise.resolve()
        const homeTab = tabs.find(o => o.id === 'home')
        if (homeTab) {
          setTabValue(homeTab.id)
          navigate(`/${homeTab.path}`)
        }
      }
    }
  ] satisfies DropdownOption[]

  const onChange = (val: TabValue) => {
    const item = allResources.find(o => o.id === val)
    if (item) {
      setTabValue(val)
      navigate(`/${item.path}`)
    }
  }

  useEffect(() => {
    if (activeResourceItem) {
      addTab(activeResourceItem)
      setTabValue(activeResourceItem.id)
    }
  }, [location])

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
                <div className='flex items-center gap-1'>
                  <RefreshIcon onClick={() => onRefreshTab(item.id)} />
                  <span>{menuName}</span>
                </div>
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
