import { SettingIcon } from 'tdesign-icons-react'
import type { CollapseProps } from 'tdesign-mobile-react'
import type { ThemeMode } from '@/global/constants'

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
    [lang, themeMode]
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

  const wrapRef = useRef<HTMLDivElement>(null)

  const onClick = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
    const wrapperEl = wrapRef.current?.parentElement?.parentElement!
    wrapperEl.style.height = '0'
  }

  const onOpen = () => {
    setPopup()
  }

  const setPopup = () => {
    const { width, left } = document.querySelector('.app-layout')!.getBoundingClientRect()

    if (wrapRef.current) {
      const wrapperEl = wrapRef.current?.parentElement?.parentElement!

      wrapperEl.style.position = 'fixed'
      wrapperEl.style.top = '0'
      wrapperEl.style.left = `${left}px`
      wrapperEl.style.width = `${width}px`
      wrapperEl.style.height = '100dvh'
      wrapperEl.style.zIndex = '1000'

      const overlayEl = wrapperEl.querySelector('.t-overlay') as HTMLElement
      const popupEl = wrapperEl.querySelector('.t-popup') as HTMLElement

      overlayEl.style.position = 'absolute'

      popupEl.style.position = 'absolute'
      popupEl.style.height = '100dvh'
      popupEl.style.width = '80%'
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setPopup()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <SettingIcon size='24' onClick={onClick} />
      <Popup
        visible={visible}
        placement='right'
        closeOnOverlayClick
        destroyOnClose
        onClose={onClose}
        onOpen={onOpen}
      >
        <div ref={wrapRef}>
          <SettingPanel />
        </div>
      </Popup>
    </>
  )
}

export const TopBar = () => {
  const { t } = useTranslation()

  return (
    <Navbar
      fixed={false}
      left={<Search shape='round' placeholder={t('component.input.placeholder')} />}
      right={<SettingBtn />}
      className='sticky top-0'
    />
  )
}
