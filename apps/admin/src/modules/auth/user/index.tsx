import { postAuthRbacListUsers } from '@/global/api'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const search = {
    items: [
      {
        formItem: {
          name: 'username',
          label: t('label.username')
        },
        component: <Input />
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'id',
      title: 'ID'
    },
    {
      colKey: 'name',
      title: t('label.name')
    },
    {
      colKey: 'username',
      title: t('label.username')
    },
    {
      colKey: 'displayUsername',
      title: t('label.displayUsername')
    },
    {
      colKey: 'email',
      title: t('label.email')
    },
    {
      colKey: 'emailVerified',
      title: t('label.emailVerified'),
      cellRenderType: 'boolean'
    },
    {
      colKey: 'createdAt',
      title: t('label.createdAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'updatedAt',
      title: t('label.updatedAt'),
      cellRenderType: 'datetime'
    }
  ] satisfies TalbeColumns

  return <GlTable rowKey='id' search={search} columns={columns} fetch={postAuthRbacListUsers} />
}
