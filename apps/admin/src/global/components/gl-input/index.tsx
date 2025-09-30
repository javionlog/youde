import type { InputProps } from 'tdesign-react'

export const GlInput = (props: InputProps) => {
  const { className, clearable = true, ...rest } = props
  return <Input className={`gl-input ${className ?? ''}`} clearable={clearable} {...rest}></Input>
}
