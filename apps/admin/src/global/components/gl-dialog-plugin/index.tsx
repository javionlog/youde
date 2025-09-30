import type { DialogOptions } from 'tdesign-react'
import { DialogPlugin } from 'tdesign-react'

const GlDialogPlugin = (opt: DialogOptions) => {
  const {
    className,
    dialogClassName,
    placement = 'center',
    closeOnOverlayClick = false,
    ...rest
  } = opt
  const defaultDialogClassName =
    'flex! flex-col w-11/12! sm:w-[400px]! md:w-[650px]! lg:w-[900px]! xl:w-[1150px]! 2xl:w-[1400]! max-h-[80dvh]'
  const fianlDialogClassName = dialogClassName
    ? `${defaultDialogClassName} ${dialogClassName}`
    : defaultDialogClassName
  return DialogPlugin({
    className: `gl-dialog ${className ?? ''}`,
    dialogClassName: fianlDialogClassName,
    placement,
    closeOnOverlayClick,
    ...rest
  })
}

GlDialogPlugin.alert = (opt: DialogOptions) => {
  const {
    className,
    dialogClassName,
    placement = 'center',
    closeOnOverlayClick = false,
    ...rest
  } = opt
  const defaultDialogClassName =
    'flex! flex-col w-11/12! sm:w-[400px]! md:w-[650px]! lg:w-[900px]! xl:w-[1150px]! 2xl:w-[1400]! max-h-[80dvh]'
  const fianlDialogClassName = dialogClassName
    ? `${defaultDialogClassName} ${dialogClassName}`
    : defaultDialogClassName

  return DialogPlugin.alert({
    className: `gl-dialog ${className ?? ''}`,
    dialogClassName: fianlDialogClassName,
    placement,
    closeOnOverlayClick,
    ...rest
  })
}

GlDialogPlugin.confirm = (opt: DialogOptions) => {
  const {
    className,
    dialogClassName,
    placement = 'center',
    closeOnOverlayClick = false,
    ...rest
  } = opt
  const defaultDialogClassName =
    'flex! flex-col w-11/12! sm:w-[400px]! md:w-[650px]! lg:w-[900px]! xl:w-[1150px]! 2xl:w-[1400]! max-h-[80dvh]'
  const fianlDialogClassName = dialogClassName
    ? `${defaultDialogClassName} ${dialogClassName}`
    : defaultDialogClassName

  return DialogPlugin.confirm({
    className: `gl-dialog ${className ?? ''}`,
    dialogClassName: fianlDialogClassName,
    placement,
    closeOnOverlayClick,
    ...rest
  })
}

export { GlDialogPlugin }
