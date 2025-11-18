import type { SelectProps } from 'tdesign-react'

export const GlSelect = (props: SelectProps) => {
  const {
    className,
    children,
    filterable = true,
    clearable = true,
    minCollapsedNum = 1,
    ...rest
  } = props
  return (
    <Select
      className={`gl-input ${className ?? ''}`}
      clearable={clearable}
      filterable={filterable}
      minCollapsedNum={minCollapsedNum}
      {...rest}
    >
      {children}
    </Select>
  )
}
