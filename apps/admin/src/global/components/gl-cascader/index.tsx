import type { CascaderProps } from 'tdesign-react'

export const GlCascader = (props: CascaderProps) => {
  const { className, clearable = true, filterable = true, minCollapsedNum = 1, ...rest } = props
  return (
    <Cascader
      className={`gl-cascader ${className ?? ''}`}
      clearable={clearable}
      filterable={filterable}
      minCollapsedNum={minCollapsedNum}
      {...rest}
    ></Cascader>
  )
}
