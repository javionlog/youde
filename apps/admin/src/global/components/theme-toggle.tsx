import { DesktopIcon, MoonIcon, SunnyIcon } from 'tdesign-icons-react'
import type { DropdownOption } from 'tdesign-react'
import { useThemeStore } from '@/global/stores'

export const ThemeToggle = () => {
  const { t } = useTranslation()
  const mode = useThemeStore(state => state.mode)

  const modeOptions = [
    {
      content: t('label.light'),
      value: 'light',
      active: mode === 'light',
      onClick: () => useThemeStore.setState({ mode: 'light' }),
      prefixIcon: <SunnyIcon style={{ color: mode === 'dark' ? 'white' : 'dark' }} size='24px' />
    },
    {
      content: t('label.dark'),
      value: 'dark',
      active: mode === 'dark',
      onClick: () => useThemeStore.setState({ mode: 'dark' }),
      prefixIcon: <MoonIcon style={{ color: mode === 'dark' ? 'white' : 'dark' }} size='24px' />
    },
    {
      content: t('label.system'),
      value: 'system',
      active: mode === 'system',
      onClick: () => useThemeStore.setState({ mode: 'system' }),
      prefixIcon: <DesktopIcon style={{ color: mode === 'dark' ? 'white' : 'dark' }} size='24px' />
    }
  ] satisfies DropdownOption[]

  return (
    <Dropdown options={modeOptions} trigger='click'>
      {modeOptions.find(o => o.value === mode)?.prefixIcon}
    </Dropdown>
  )
}
