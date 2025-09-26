import type { CSSProperties } from 'react'
import type { TableProps, TableRowData } from 'tdesign-react'

declare global {
  interface StyledProps {
    className?: string
    style?: CSSProperties
  }

  interface GlTableExtendColumn {
    cellRenderType?: 'date' | 'datetime' | 'boolean'
  }

  type GlTalbeColumns<T extends TableRowData = TableRowData> = (NonNullable<
    TableProps<T>['columns']
  >[number] &
    GlTableExtendColumn)[]
}
