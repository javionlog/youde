import type { CSSProperties } from 'react'
import type { TableProps } from 'tdesign-react'

declare global {
  interface StyledProps {
    className?: string
    style?: CSSProperties
  }

  interface GlTableExtendColumn {
    cellRenderType?: 'date' | 'datetime' | 'boolean'
  }

  type GlTalbeColumns = (NonNullable<TableProps['columns']>[number] & GlTableExtendColumn)[]
}
