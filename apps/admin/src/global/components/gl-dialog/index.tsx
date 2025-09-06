import type { DialogProps } from 'tdesign-react'

export const GlDialog = (props: DialogProps) => {
  const { children, className, dialogClassName, placement = 'center', ...rest } = props
  const defaultClassName = 'gb-dialog'
  const finalClassName = className ? `${defaultClassName} ${className}` : defaultClassName
  const defaultDialogClassName =
    'flex! flex-col w-4/5! md:w-[640px]! lg:w-[960px]! xl:w-[1200px]! 2xl:w-[1400px]! max-h-[80vh]'
  const fianlDialogClassName = dialogClassName
    ? `${defaultDialogClassName} ${dialogClassName}`
    : defaultDialogClassName
  return (
    <Dialog
      className={finalClassName}
      dialogClassName={fianlDialogClassName}
      placement={placement}
      {...rest}
    >
      {children}
    </Dialog>
  )
}
