import type { PrimaryTableProps, PrimaryTableRef } from 'tdesign-react'

export const GlTable = forwardRef<PrimaryTableRef, PrimaryTableProps>((props, ref) => {
  return <Table ref={ref} {...props} />
})
