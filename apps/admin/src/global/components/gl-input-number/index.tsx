import type { InputNumberProps } from 'tdesign-react'

export const GlInputNumber = (props: InputNumberProps) => {
  const { className, ...rest } = props
  return <InputNumber className={`gl-input-number ${className ?? ''}`} {...rest}></InputNumber>
}
