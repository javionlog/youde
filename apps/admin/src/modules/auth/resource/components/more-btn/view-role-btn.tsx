export const ViewRoleBtn = () => {
  const { t } = useTranslation()

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: t('resource.action.viewAssociatedRole', { ns: 'auth' }),
      footer: false
    })
  }

  return <div onClick={onOpen}>{t('resource.action.viewAssociatedRole', { ns: 'auth' })}</div>
}
