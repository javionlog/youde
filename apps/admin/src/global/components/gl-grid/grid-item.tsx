import type { ReactNode } from 'react'

export interface GlGridItemProps extends StyledProps {
  children?: ReactNode
  column?: { span?: number; offset?: number }
}

interface InternalProps extends GlGridItemProps {
  _hidden?: boolean
  _gridColumn?: string
  _marginLeft?: string
}

export const GlGridItem = (props: GlGridItemProps) => {
  const { children, style, className } = props
  const { _hidden, _gridColumn, _marginLeft } = props as InternalProps

  return (
    <div
      className={`gl-grid-item min-w-0 ${className ?? ''}`}
      style={{
        gridColumn: _gridColumn,
        marginLeft: _marginLeft,
        display: _hidden ? 'none' : undefined,
        ...style
      }}
    >
      {children}
    </div>
  )
}
