import type { DialogProps } from 'tdesign-react'
export const GbDialog = (props: DialogProps) => {
  const defaultClassName = 'gb-dialog'
  const defaultDialogClassName =
    'flex! flex-col w-4/5! md:w-[640px]! lg:w-[960px]! xl:w-[1200px]! 2xl:w-[1400px]! max-h-[80vh]'
  const { children, className, dialogClassName, placement = 'center', ...rest } = props
  return (
    <Dialog
      className={`${defaultClassName} ${className ?? ''}`}
      dialogClassName={`${defaultDialogClassName} ${dialogClassName ?? ''}`}
      placement={placement}
      {...rest}
    >
      {children}
    </Dialog>
  )
}
