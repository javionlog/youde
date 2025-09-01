import { MoonIcon, SunnyIcon } from 'tdesign-icons-react'
import type { DropdownOption } from 'tdesign-react'

export const ThemeSelect = () => {
  const { t } = useTranslation()
  const themeMode = useThemeStore(state => state.mode)

  const modeOptions = [
    {
      content: t('label.light'),
      value: 'light',
      active: themeMode === 'light',
      onClick: () => useThemeStore.setState({ mode: 'light' }),
      prefixIcon: <SunnyIcon size='24px' />
    },
    {
      content: t('label.dark'),
      value: 'dark',
      active: themeMode === 'dark',
      onClick: () => useThemeStore.setState({ mode: 'dark' }),
      prefixIcon: <MoonIcon size='24px' />
    }
  ] satisfies DropdownOption[]

  return (
    <Dropdown options={modeOptions} trigger='click'>
      {modeOptions.find(o => o.value === themeMode)?.prefixIcon}
    </Dropdown>
  )
}
