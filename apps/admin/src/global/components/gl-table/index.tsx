import type { PrimaryTableProps } from 'tdesign-react'

type SearchFormProps = Parameters<typeof GlSearchForm>[0]

interface Props extends StyledProps, PrimaryTableProps {
  searchForm: SearchFormProps
}

export const GlTable = (props: Props) => {
  const { className, style, searchForm, ...tableProps } = props
  const defaultClassName = 'gl-table'
  return (
    <div className={`${defaultClassName} ${className ?? ''}`} style={style}>
      <GlSearchForm {...searchForm} />
      <Table {...tableProps} />
    </div>
  )
}
