import type { DialogProps } from 'tdesign-react'

export const GlDialog = (props: DialogProps) => {
  const {
    children,
    className,
    dialogClassName,
    placement = 'center',
    closeOnOverlayClick = false,
    ...rest
  } = props
  const defaultDialogClassName =
    'flex! flex-col w-11/12! sm:w-[400px]! md:w-[650px]! lg:w-[900px]! xl:w-[1150px]! 2xl:w-[1400]! max-h-[80dvh]'
  const fianlDialogClassName = dialogClassName
    ? `${defaultDialogClassName} ${dialogClassName}`
    : defaultDialogClassName
  return (
    <Dialog
      className={`gl-dialog ${className ?? ''}`}
      dialogClassName={fianlDialogClassName}
      placement={placement}
      closeOnOverlayClick={closeOnOverlayClick}
      {...rest}
    >
      {children}
    </Dialog>
  )
}
