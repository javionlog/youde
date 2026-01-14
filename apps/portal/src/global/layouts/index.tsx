import { useTranslation } from 'react-i18next'
import { TopBar } from './top-bar'

export default () => {
  const { t } = useTranslation()

  // console.log('isBrower', i18n.getResourceBundle('zh-cn', 'global'))
  // const text = t('component.input.placeholder', { lng: 'zh-cn', ns: 'global' })

  const text = t('component.input.placeholder')

  return (
    <div className='app-layout mx-auto flex h-dvh max-w-lg flex-col'>
      <TopBar />
      <div className='min-h-0'>
        <div>{text}</div>
        <Outlet />
      </div>
    </div>
  )
}
