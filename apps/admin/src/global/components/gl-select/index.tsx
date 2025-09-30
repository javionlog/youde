import type { SelectProps } from 'tdesign-react'

export const GlSelect = (props: SelectProps) => {
  const { className, children, clearable = true, ...rest } = props
  return (
    <Select className={`gl-input ${className ?? ''}`} clearable={clearable} {...rest}>
      {children}
    </Select>
  )
}
