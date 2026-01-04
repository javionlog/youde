export const TreasurePanel = () => {
  const { t } = useTranslation()

  return <div className='mt-4'>{t('treasure.label.treasure', { ns: 'content' })}</div>
}
