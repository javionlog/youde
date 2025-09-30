import type { DropdownProps } from 'tdesign-react'

const GlDropdown = (props: DropdownProps) => {
  const { className, children, maxColumnWidth = 'auto', ...rest } = props
  return (
    <Dropdown
      className={`gl-dropdown ${className ?? ''}`}
      maxColumnWidth={maxColumnWidth}
      {...rest}
    >
      {children}
    </Dropdown>
  )
}

GlDropdown.GlDropdownMenu = Dropdown.DropdownMenu
GlDropdown.GlDropdownItem = Dropdown.DropdownItem

export { GlDropdown }
