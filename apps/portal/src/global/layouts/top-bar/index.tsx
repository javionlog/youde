import { SettingIcon } from 'tdesign-icons-react'
import type { CollapseProps } from 'tdesign-mobile-react'

const SettingPanel = () => {
  const lang = useLocaleStore(state => state.lang)
  const [collapseValue, setCollapseValue] = useState<number[]>([])
  const { i18n } = useTranslation()

  const settins = [
    {
      header: '设置语言',
      value: 'lang',
      children: (
        <RadioGroup
          value={lang}
          onChange={val => {
            const activeLang = val as 'en-us'
            useLocaleStore.setState({ lang: activeLang })
            i18n.changeLanguage(activeLang)
          }}
        >
          <Radio label='English' value='en-us' />
          <Radio label='简体中文' value='zh-cn' />
        </RadioGroup>
      )
    }
  ]

  const onChange: CollapseProps['onChange'] = val => {
    setCollapseValue(val as number[])
  }

  return (
    <Collapse value={collapseValue} onChange={onChange} expandMutex>
      {settins.map(item => {
        return (
          <CollapsePanel key={item.value} header={item.header}>
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
  // const { i18n } = useTranslation()

  // const [state, setState] = useState('')

  // const placeholder = t('component.input.placeholder')

  // useEffect(() => {
  //   setState(t('component.input.placeholder'))
  // }, [])

  return (
    <Navbar
      fixed={false}
      left={<Search shape='round' />}
      right={<SettingBtn />}
      className='sticky top-0'
    />
  )
}
