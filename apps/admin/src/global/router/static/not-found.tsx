export const NotFound = () => {
  const { t } = useTranslation()
  return <div>{t('message.pageNotFound')}</div>
}

export default NotFound
