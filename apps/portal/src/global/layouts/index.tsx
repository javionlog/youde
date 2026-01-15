import { TopBar } from './top-bar'

export default () => {
  const { i18n } = useTranslation()
  const lang = useLocaleStore(state => state.lang)

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang])

  return (
    <div className='app-layout mx-auto flex h-dvh max-w-lg flex-col'>
      <TopBar />
      <div className='min-h-0'>
        <Outlet />
      </div>
    </div>
  )
}
