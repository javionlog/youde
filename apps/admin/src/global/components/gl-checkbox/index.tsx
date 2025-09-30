import type { CheckboxProps } from 'tdesign-react'

export const GlCheckbox = (props: CheckboxProps) => {
  const { children, className, ...rest } = props
  return (
    <Checkbox className={`gl-checkbox ${className ?? ''}`} {...rest}>
      <GlEllipsis>{children}</GlEllipsis>
    </Checkbox>
  )
}
