import { MoonIcon, SunnyIcon } from 'tdesign-icons-react'
import type { DropdownOption } from 'tdesign-react'

export const GlThemeSelect = () => {
  const { t } = useTranslation()
  const themeMode = useAppStore(state => state.themeMode)

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
      onClick: () => useAppStore.setState({ themeMode: 'light' }),
      prefixIcon: iconMap.light()
    },
    {
      content: t('label.dark'),
      value: 'dark',
      active: themeMode === 'dark',
      onClick: () => useAppStore.setState({ themeMode: 'dark' }),
      prefixIcon: iconMap.dark()
    }
  ] satisfies DropdownOption[]

  return (
    <GlDropdown options={themeModeOptions} trigger='click'>
      {iconMap[themeMode]('24px')}
    </GlDropdown>
  )
}
