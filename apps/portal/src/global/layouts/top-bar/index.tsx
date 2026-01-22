import { ChevronRightIcon, CloseIcon, FilterIcon, SettingIcon } from 'tdesign-icons-react'
import type { CascaderProps, CollapseProps, PickerProps, SearchProps } from 'tdesign-mobile-react'
import type { ThemeMode } from '@/global/constants'
import type { FeeValue } from '@/global/enums/common'

const SettingPanel = () => {
  const { t } = useTranslation()
  const lang = useLocaleStore(state => state.lang)
  const themeMode = useAppStore(state => state.themeMode)
  const [collapseValue, setCollapseValue] = useState<number[]>([])
  const { i18n } = useTranslation()

  const settins = useMemo(
    () => [
      {
        header: t('label.languageSetting'),
        value: 'lang',
        children: (
          <RadioGroup
            value={lang}
            onChange={val => {
              const activeLang = val as LangType
              useLocaleStore.setState({ lang: activeLang })
              i18n.changeLanguage(activeLang)
              fetch(`/locale-sync`, {
                method: 'Post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lang: activeLang })
              })
            }}
          >
            {getOptions('LANG_OPTION').map(item => {
              return <Radio key={item.value} label={item.label} value={item.value} />
            })}
          </RadioGroup>
        )
      },
      {
        header: t('label.themeMode'),
        value: 'themeMode',
        children: (
          <RadioGroup
            value={themeMode}
            onChange={val => {
              const activeThemeMode = val as ThemeMode
              useAppStore.setState({ themeMode: activeThemeMode })
              fetch(`/preference-sync`, {
                method: 'Post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  themeMode: activeThemeMode
                })
              })
            }}
          >
            {getOptions('THEME_MODE').map(item => {
              return <Radio key={item.value} label={item.label} value={item.value} />
            })}
          </RadioGroup>
        )
      }
    ],
    [i18n.language, themeMode]
  )

  const onChange: CollapseProps['onChange'] = val => {
    setCollapseValue(val as number[])
  }

  return (
    <Collapse value={collapseValue} onChange={onChange}>
      {settins.map(item => {
        return (
          <CollapsePanel key={item.value} value={item.value} header={item.header}>
            {item.children}
          </CollapsePanel>
        )
      })}
    </Collapse>
  )
}

const SettingBtn = () => {
  const [visible, setVisible] = useState(false)

  const onClick = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
      <SettingIcon size='24' onClick={onClick} />
      <Popup
        visible={visible}
        placement='right'
        closeOnOverlayClick
        destroyOnClose
        onClose={onClose}
      >
        <div className='h-full w-[80vw] overflow-auto'>
          <SettingPanel />
        </div>
      </Popup>
    </>
  )
}

const CategoryCell = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const categoryTree = useCategoryStore(state => state.tree)
  const categoryId = useSearchStore(state => state.value.categoryIds?.[0])

  const onChange: CascaderProps['onChange'] = value => {
    useSearchStore.setState(state => ({
      value: { ...state.value, categoryIds: [value as string] }
    }))
    emitter.emit('search', {})
  }

  const onClearCategory = () => {
    useSearchStore.setState(state => ({ value: { ...state.value, categoryIds: [] } }))
    emitter.emit('search', {})
    setVisible(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  const description = useMemo(() => {
    const categoryList = flattenTree(categoryTree)
    const categoryItem = categoryList.find(o => o.id === categoryId)
    if (categoryItem) {
      const parentNames = getParentNodes(categoryTree, categoryItem.id).map(o => o.label)
      return [...parentNames, categoryItem.label].join(' / ')
    }
  }, [categoryId, categoryTree])

  return (
    <>
      <Cell
        title={t('label.category')}
        description={description}
        rightIcon={
          categoryId ? (
            <CloseIcon
              onClick={event => {
                event.stopPropagation()
                onClearCategory()
              }}
            />
          ) : (
            <ChevronRightIcon />
          )
        }
        onClick={() => {
          setVisible(true)
        }}
      />
      <Overlay visible={visible}>
        {visible && (
          <Cascader
            visible
            theme='tab'
            title={t('label.category')}
            value={categoryId}
            options={categoryTree}
            onChange={onChange}
            onClose={onClose}
          />
        )}
      </Overlay>
    </>
  )
}

const FeeCell = () => {
  const { t, i18n } = useTranslation()
  const [visible, setVisible] = useState(false)
  const fees = useSearchStore(state => state.value.fees) ?? []

  const onClearFee = () => {
    useSearchStore.setState(state => ({
      value: { ...state.value, fees: [] }
    }))
    emitter.emit('search', {})
    setVisible(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onConfirm: PickerProps['onConfirm'] = value => {
    const pickedValue = value as FeeValue[]
    useSearchStore.setState(state => ({
      value: { ...state.value, fees: pickedValue }
    }))
    emitter.emit('search', {})
    setVisible(false)
  }

  const description = useMemo(() => {
    return getTranslate('FEE', fees[0])
  }, [fees])

  const feeOptions = useMemo(() => {
    return getOptions('FEE')
  }, [i18n.language])

  return (
    <>
      <Cell
        title={t('label.fee')}
        description={description}
        rightIcon={
          fees.length ? (
            <CloseIcon
              onClick={event => {
                event.stopPropagation()
                onClearFee()
              }}
            />
          ) : (
            <ChevronRightIcon />
          )
        }
        onClick={() => {
          setVisible(true)
        }}
      />
      <Overlay visible={visible}>
        {visible && (
          <Popup visible onClose={onClose} placement='bottom'>
            <Picker
              value={fees}
              title={t('label.fee')}
              columns={feeOptions}
              onCancel={onClose}
              onConfirm={onConfirm}
            />
          </Popup>
        )}
      </Overlay>
    </>
  )
}

const FilterPanel = () => {
  return (
    <CellGroup>
      <CategoryCell />
      <FeeCell />
    </CellGroup>
  )
}

const FilterBtn = () => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  const onClick = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onReset = () => {
    useSearchStore.setState({ value: {} })
    emitter.emit('search', {})
  }

  return (
    <>
      <FilterIcon size='24' onClick={onClick} />
      <Popup
        visible={visible}
        placement='right'
        closeOnOverlayClick
        destroyOnClose
        onClose={onClose}
      >
        <div className='h-full w-[80vw] overflow-auto pb-10'>
          <FilterPanel />
          <Button block className='absolute! bottom-0' onClick={onReset}>
            {t('action.reset')}
          </Button>
        </div>
      </Popup>
    </>
  )
}

export const TopBar = () => {
  const { t } = useTranslation()
  const { title } = useSearchStore(state => state.value)

  const onChange: SearchProps['onChange'] = (val: string) => {
    useSearchStore.setState(state => ({ value: { ...state.value, title: val } }))
  }

  const onSubmit: SearchProps['onSubmit'] = ({ value }) => {
    emitter.emit('search', { title: value })
  }

  return (
    <Navbar
      fixed={false}
      left={
        <Search
          value={title ?? ''}
          shape='round'
          placeholder={t('component.input.placeholder')}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      }
      right={
        <div className='flex gap-2'>
          <FilterBtn />
          <SettingBtn />
        </div>
      }
      className='sticky top-0'
    />
  )
}
