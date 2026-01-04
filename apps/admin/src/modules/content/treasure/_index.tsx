import type { TabsProps } from 'tdesign-react'
import { CategoryPanel } from './category'
import { TreasurePanel } from './treasure'

export default () => {
  const { t } = useTranslation()

  const tabList = [
    {
      label: t('treasure.label.treasure', { ns: 'content' }),
      value: 'treasure',
      lazy: true,
      destroyOnHide: false,
      panel: <TreasurePanel />
    },
    {
      label: t('treasure.label.category', { ns: 'content' }),
      value: 'category',
      lazy: true,
      destroyOnHide: false,
      panel: <CategoryPanel />
    }
  ] satisfies TabsProps['list']

  return <GlTabs defaultValue='treasure' list={tabList} />
}
