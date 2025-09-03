import { MoonIcon, SunnyIcon } from 'tdesign-icons-react'
import type { DropdownOption } from 'tdesign-react'

export const ThemeSelect = () => {
  const { t } = useTranslation()
  const themeMode = useThemeStore(state => state.mode)

  const iconMap = {
    light: (size?: string) => {
      return <SunnyIcon size={size ?? '14px'} />
    },
    dark: (size?: string) => {
      return <MoonIcon size={size ?? '14px'} />
    }
  }

  const themeModeOptions = [
    {
      content: t('label.light'),
      value: 'light',
      active: themeMode === 'light',
      onClick: () => useThemeStore.setState({ mode: 'light' }),
      prefixIcon: iconMap.light()
    },
    {
      content: t('label.dark'),
      value: 'dark',
      active: themeMode === 'dark',
      onClick: () => useThemeStore.setState({ mode: 'dark' }),
      prefixIcon: iconMap.dark()
    }
  ] satisfies DropdownOption[]

  return (
    <Dropdown options={themeModeOptions} trigger='click'>
      {iconMap[themeMode]('24px')}
    </Dropdown>
  )
}
