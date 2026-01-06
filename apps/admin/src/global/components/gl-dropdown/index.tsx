import type { DropdownProps } from 'tdesign-react'

export const GlDropdown = (props: DropdownProps) => {
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

export const GlDropdownMenu = Dropdown.DropdownMenu
export const GlDropdownItem = Dropdown.DropdownItem
