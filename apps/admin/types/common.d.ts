import type { CSSProperties } from 'react'
import type { TableProps } from 'tdesign-react'

declare global {
  interface StyledProps {
    className?: string
    style?: CSSProperties
  }

  interface TableExtendColumn {
    cellRenderType?: 'date' | 'datetime' | 'boolean'
  }

  type TalbeColumns = (NonNullable<TableProps['columns']>[number] & TableExtendColumn)[]
}
