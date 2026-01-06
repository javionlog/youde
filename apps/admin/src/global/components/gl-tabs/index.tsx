import type { TabsProps } from 'tdesign-react'

export const GlTabs = (
  props: Omit<TabsProps, 'size'> & {
    size?: TabsProps['size'] | 'small'
  }
) => {
  const { className, children, size, ...rest } = props
  const tabSize = size as TabsProps['size']
  return (
    <Tabs
      className={`gl-tabs ${className ?? ''} ${size === 'small' ? 't-size-s' : ''}`}
      size={tabSize}
      {...rest}
    >
      {children}
    </Tabs>
  )
}

export const GlTabPanel = Tabs.TabPanel
