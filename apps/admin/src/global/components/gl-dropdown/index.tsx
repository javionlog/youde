import type { DropdownProps } from 'tdesign-react'

const GlDropdown = (props: DropdownProps) => {
  const { children, maxColumnWidth = 'auto', ...rest } = props
  return (
    <Dropdown maxColumnWidth={maxColumnWidth} {...rest}>
      {children}
    </Dropdown>
  )
}

GlDropdown.GlDropdownMenu = Dropdown.DropdownMenu
GlDropdown.GlDropdownItem = Dropdown.DropdownItem

export { GlDropdown }
