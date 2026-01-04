import type { CSSProperties } from 'react'
import type { TableProps, TableRowData } from 'tdesign-react'
import type { EnumKeys } from '@/global/enums'

declare global {
  interface StyledProps {
    className?: string
    style?: CSSProperties
  }

  interface GlTableExtendColumn {
    cellRenderType?: 'date' | 'datetime' | 'boolean' | 'enum'
    enumKey?: EnumKeys
  }

  type GlTalbeColumns<T extends TableRowData = TableRowData> = (NonNullable<
    TableProps<T>['columns']
  >[number] &
    GlTableExtendColumn)[]
}
