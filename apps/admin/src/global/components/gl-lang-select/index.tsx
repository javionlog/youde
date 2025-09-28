import { TranslateIcon } from 'tdesign-icons-react'
import type { DropdownOption } from 'tdesign-react'

export const GlLangSelect = () => {
  const lang = useLocaleStore(state => state.lang)

  const enLang = 'en-us'
  const zhLang = 'zh-cn'
  const langOptions = [
    {
      content: 'English',
      value: enLang,
      active: lang === enLang,
      onClick: () => {
        useLocaleStore.setState({ lang: enLang })
        i18n.changeLanguage(enLang)
      }
    },
    {
      content: '简体中文',
      value: zhLang,
      active: lang === zhLang,
      onClick: () => {
        useLocaleStore.setState({ lang: zhLang })
        i18n.changeLanguage(zhLang)
      }
    }
  ] satisfies DropdownOption[]

  return (
    <Dropdown maxColumnWidth='auto' options={langOptions} trigger='click'>
      <TranslateIcon size='24px' />
    </Dropdown>
  )
}
