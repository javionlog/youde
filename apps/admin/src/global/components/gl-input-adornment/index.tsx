import type { InputAdornmentProps } from 'tdesign-react'

export const GlInputAdornment = (props: InputAdornmentProps) => {
  const { className, ...rest } = props
  return (
    <InputAdornment className={`gl-input-adornment ${className ?? ''}`} {...rest}></InputAdornment>
  )
}
