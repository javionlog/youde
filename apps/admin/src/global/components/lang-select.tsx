import type { LangValue } from '@/global/constants'
import { LANG_OPTIONS } from '@/global/constants'
import { i18n } from '@/global/locales'
import { useLocaleStore } from '@/global/stores'

export const LangSelect = () => {
  const lang = useLocaleStore(state => state.lang)
  const { setLang } = useLocaleStore()
  const onChange = (val: any) => {
    const value = val as LangValue
    setLang(value)
    i18n.changeLanguage(value)
  }

  return <Select value={lang} options={LANG_OPTIONS} onChange={onChange} />
}
